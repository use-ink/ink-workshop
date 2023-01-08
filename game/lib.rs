#![cfg_attr(not(feature = "std"), no_std)]

pub use squink_splash::{
    Field,
    SquinkSplash,
    SquinkSplashRef,
};

#[ink::contract]
mod squink_splash {
    use core::ops::RangeInclusive;
    use ink::{
        env::{
            call::{
                build_call,
                Call,
                ExecutionInput,
                Selector,
            },
            debug_println,
            CallFlags,
            DefaultEnvironment,
        },
        prelude::{
            collections::BTreeMap,
            string::String,
            vec::Vec,
        },
        storage::{
            Lazy,
            Mapping,
        },
        LangError,
    };

    /// The amount of players that are allowed to register for a single game.
    const PLAYER_LIMIT: usize = 25;

    /// Maximum number of bytes in a players name.
    const ALLOWED_NAME_SIZES: RangeInclusive<usize> = 3..=16;

    #[ink(storage)]
    pub struct SquinkSplash {
        /// In which game phase is this contract.
        state: State,
        /// List of fields with their owner (if any).
        board: Mapping<u32, AccountId>,
        /// Width and height of the board.
        dimensions: Field,
        /// List of all players.
        players: Lazy<Vec<Player>>,
        /// The amount of balance that needs to be payed to join the game.
        buy_in: Balance,
        /// The amount of blocks that this game is played for once it started.
        rounds: u32,
        /// The overall gas each player can use over the course of the whole game.
        gas_limit: u64,
    }

    /// The game can be in different states over its lifetime.
    #[derive(scale::Decode, scale::Encode, Clone)]
    #[cfg_attr(
        feature = "std",
        derive(Debug, scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub enum State {
        /// The initial state of the game.
        ///
        /// The game is in this state right after instantiation of the contract. This is
        /// the only state in which players can be registered. No turns can be submitted
        /// in this state.
        Forming {
            /// When this block is reached everybody can can call `start_game` in order
            /// to progress the state to `Running`.
            earliest_start: u32,
        },
        /// This is the actual playing phase which is entered after calling `start_game`.
        ///
        /// No new players can be registered in this phase.
        Running {
            /// The block in which `start_game` was called.
            start_block: u32,
            /// The block at which the game ends and no new turns will be accepted. Everybody
            /// can call `end_game` once this block is reached in order to progress the
            /// `State` to `Finished`.
            end_block: u32,
        },
        /// The game is finished an the pot has been payed out to the `winner`.
        Finished {
            /// The player with the highest score when the game ended.
            ///
            /// This player is also the one which is allowed to call `destroy` to remove
            /// the contract. This means that the winner will also collect the storage
            /// deposits put down by all players as an additional price.
            winner: AccountId,
        },
    }

    #[derive(scale::Decode, scale::Encode)]
    #[cfg_attr(
        feature = "std",
        derive(Debug, scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct Player {
        id: AccountId,
        name: String,
        gas_used: u64,
        /// The block number this player made its last turn.
        last_turn: u32,
    }

    /// Describing either a single point in the field or its dimensions.
    #[derive(scale::Decode, scale::Encode, Clone, Copy, Debug)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct Field {
        /// The width component.
        pub x: u32,
        /// The height component.
        pub y: u32,
    }

    /// The different effects resulting from a player making a turn.
    ///
    /// Please note that these are only the failures that don't make the transaction fail
    /// and hence cause an actual state change. For example, trying to do multiple turns
    /// per block or submitting a turn for an unregistered player are not covered.
    #[derive(scale::Decode, scale::Encode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum TurnOutcome {
        /// A field was painted.
        Success {
            /// The field that was painted.
            turn: Field,
        },
        /// The contract's turn lies outside of the playing field.
        OutOfBounds {
            /// The turn that lies outside the playing field.
            turn: Field,
        },
        /// Someone else already painted the field and hence it can't be painted.
        Occupied {
            /// The turn that tried to paint.
            turn: Field,
            /// The player that occupies the field that was tried to be painted by `turn`.
            player: AccountId,
        },
        /// Player contract failed to return a result. This happens if it paniced, ran out
        /// of gas, returns garbage or is not even a contract.
        BrokenPlayer,
    }

    /// Someone started the game by calling `start_game`.
    #[ink(event)]
    pub struct GameStarted {
        /// The account start called `start_game`.
        starter: AccountId,
    }

    /// A player attempted to make a turn.
    #[ink(event)]
    pub struct TurnTaken {
        /// The player that attempted the turn.
        player: AccountId,
        /// The effect of the turn that was performed by the player.
        outcome: TurnOutcome,
    }

    /// Someone ended the game by calling `end_game`.
    ///
    /// This event doesn't contain information about the winner because the contract still
    /// exists. Interested parties can read this information from the contract by calling
    /// `state` and `player_scores`.
    #[ink(event)]
    pub struct GameEnded {
        /// The account that ended the game.
        ender: AccountId,
    }

    /// The game ended and the winner destroyed the contract.
    #[ink(event)]
    pub struct GameDestroyed {
        /// The winning player who is also the one who destroyed the contract.
        winner: Player,
        /// The winning score of the player.
        score: u64,
    }

    impl SquinkSplash {
        /// Create a new game.
        ///
        /// - `dimensions`: (width,height) Of the board
        /// - `buy_in`: The amount of balance each player needs to submit in order to play.
        /// - `forming_rounds`: Number of blocks that needs to pass until anyone can start the game.
        /// - `rounds`: The number of blocks a game can be played for.
        /// - `score_multiplier`: The higher the more score you get per field.
        /// - `gas_per_round`: The amount of gas each player can use. Unused gas is carried over to the next round.
        #[ink(constructor)]
        pub fn new(
            dimensions: Field,
            buy_in: Balance,
            forming_rounds: u32,
            rounds: u32,
            gas_per_round: u64,
        ) -> Self {
            let mut ret = Self {
                state: State::Forming {
                    earliest_start: Self::env().block_number() + forming_rounds,
                },
                board: Default::default(),
                dimensions,
                players: Default::default(),
                buy_in,
                rounds,
                gas_limit: gas_per_round * u64::from(rounds),
            };
            ret.players.set(&Vec::new());
            ret
        }

        /// When the game is in finished the contract can be deleted by the winner.
        #[ink(message)]
        pub fn destroy(&mut self) {
            if let State::Finished { winner } = self.state {
                assert_eq!(
                    winner,
                    self.env().caller(),
                    "Only winner is allowed to destroy the contract."
                );
                let (winning_player, score) = self
                    .player_score_iter()
                    .find(|(player, _score)| player.id == winner)
                    .expect("The winner is a player; qed");
                self.env().emit_event(GameDestroyed {
                    winner: winning_player,
                    score,
                });
                self.env().terminate_contract(winner)
            } else {
                panic!("Only finished games can be destroyed.")
            }
        }

        /// Anyone can start the game when `earliest_start` is reached.
        #[ink(message)]
        pub fn start_game(&mut self) {
            if let State::Forming { earliest_start } = self.state {
                assert!(
                    self.env().block_number() >= earliest_start,
                    "Game can't be started, yet."
                );
            } else {
                panic!("Game already started.")
            };
            let players = self.players();
            assert!(!players.is_empty(), "You need at least one player.");
            let start_block = self.env().block_number();
            let end_block = start_block + self.rounds;
            self.state = State::Running {
                start_block,
                end_block,
            };
            self.env().emit_event(GameStarted {
                starter: self.env().caller(),
            });
        }

        /// When enough time has passed no new turns can be submitted.
        /// Then everybody can call this to end the game and trigger the payout to
        /// the winner.
        #[ink(message)]
        pub fn end_game(&mut self) {
            match self.state {
                State::Running { end_block, .. }
                    if self.env().block_number() >= end_block =>
                {
                    let mut num_players = 0u64;
                    let winner = self
                        .player_score_iter()
                        .max_by_key(|(_player, score)| {
                            num_players += 1;
                            *score
                        })
                        .expect("We only allow starting the game with at least 1 player.")
                        .0
                        .id;

                    // Give the pot to the winner
                    self.env()
                        .transfer(winner, Balance::from(num_players) * self.buy_in)
                        .unwrap();

                    self.state = State::Finished { winner };
                    self.env().emit_event(GameEnded {
                        ender: self.env().caller(),
                    });
                }
                _ => panic!("Game can't be ended or has already ended."),
            }
        }

        /// Add a new player to the game. Only allowed while the game has not started.
        #[ink(message, payable)]
        pub fn register_player(&mut self, id: AccountId, name: String) {
            assert!(
                matches!(self.state, State::Forming { .. }),
                "Players can only be registered in the forming phase."
            );
            assert!(
                ALLOWED_NAME_SIZES.contains(&name.len()),
                "Invalid length for name. Allowed: [{}, {}]",
                ALLOWED_NAME_SIZES.start(),
                ALLOWED_NAME_SIZES.end()
            );
            assert_eq!(
                self.buy_in,
                self.env().transferred_value(),
                "Wrong buy in. Needs to be: {}",
                self.buy_in
            );
            let mut players = self.players();
            assert!(
                players.len() < PLAYER_LIMIT,
                "Maximum player count reached."
            );
            match Self::find_player(&id, &players) {
                Err(idx) => {
                    assert!(
                        !players.iter().any(|p| p.name == name),
                        "This name is already taken."
                    );
                    players.insert(
                        idx,
                        Player {
                            id,
                            name,
                            gas_used: 0,
                            last_turn: 0,
                        },
                    );
                    self.players.set(&players);
                }
                Ok(_) => panic!("Player already registered."),
            }
        }

        /// Each block every player can submit their turn.
        ///
        /// Each player can only make one turn per block. If the contract panics or fails
        /// to return the proper result the turn of forfeited and the gas usage is still recorded.
        #[ink(message)]
        pub fn submit_turn(&mut self, id: AccountId) {
            assert!(
                self.is_running(),
                "The game does not accept turns right now."
            );
            let mut players = self.players();
            let player = if let Some(player) = Self::player_mut(&id, &mut players) {
                // We need to immediately write back the the players since we need to record
                // that a player did attempted a turn. Otherwise a player could make multiple
                // turns per round by reentrancy.
                let current_block = self.env().block_number();
                assert!(
                    player.last_turn < current_block,
                    "This player already made its turn for this round. Last turn: {} Current Block: {}",
                    player.last_turn, current_block,
                );
                player.last_turn = current_block;
                self.players.set(&players);
                // need to reborrow
                Self::player_mut(&id, &mut players).unwrap()
            } else {
                panic!("Player not registered.")
            };

            // We need to panic early on `0` because zero means "use all gas".
            let gas_left = self.gas_limit.saturating_sub(player.gas_used);
            if gas_left == 0 {
                panic!("No gas left to make further turns.")
            }

            // We need to call with reentrancy enabled to allow those contracts to query us.
            let call = build_call::<DefaultEnvironment>()
                .call_type(Call::new().callee(player.id))
                .gas_limit(gas_left)
                .exec_input(ExecutionInput::new(Selector::from([0x00; 4])))
                .call_flags(CallFlags::default().set_allow_reentry(true))
                .returns::<Result<Field, LangError>>();

            let gas_before = self.env().gas_left();
            let turn = call.fire();
            player.gas_used += gas_before - self.env().gas_left();

            // We don't bubble up the error cause we still want to record the gas usage
            // and disallow another try. This should be enough punishment for a defunct contract.
            let outcome = match turn {
                Ok(Ok(turn)) => {
                    if !self.is_valid_coord(&turn) {
                        TurnOutcome::OutOfBounds { turn }
                    } else {
                        if let Some(player) = self.board.get(self.idx(&turn)) {
                            TurnOutcome::Occupied { turn, player }
                        } else {
                            self.board.insert(self.idx(&turn), &player.id);
                            TurnOutcome::Success { turn }
                        }
                    }
                }
                err => {
                    debug_println!("Contract failed to make a turn: {:?}", err);
                    TurnOutcome::BrokenPlayer
                }
            };

            self.env().emit_event(TurnTaken {
                player: player.id,
                outcome,
            });

            self.players.set(&players);
        }

        /// The buy in amount to register a player
        #[ink(message)]
        pub fn buy_in_amount(&self) -> Balance {
            self.buy_in
        }

        /// The current game state.
        #[ink(message)]
        pub fn state(&self) -> State {
            self.state.clone()
        }

        /// List of all players sorted by id.
        #[ink(message)]
        pub fn players(&self) -> Vec<Player> {
            self.players
                .get()
                .expect("Initial value is set in constructor.")
        }

        /// List of of all players (sorted by id) and their current scores.
        #[ink(message)]
        pub fn player_scores(&self) -> Vec<(Player, u64)> {
            self.player_score_iter().collect()
        }

        /// Returns the dimensions of the board.
        #[ink(message)]
        pub fn dimensions(&self) -> Field {
            self.dimensions
        }

        /// Returns the gas limit configured for this game.
        #[ink(message)]
        pub fn gas_limit(&self) -> u64 {
            self.gas_limit
        }

        /// Returns the value (owner) of the supplied field.
        #[ink(message)]
        pub fn field(&self, coord: Field) -> Option<AccountId> {
            self.board.get(self.idx(&coord))
        }

        /// Returns the complete board.
        ///
        /// The index into the vector is calculated as `x + y * width`.
        #[ink(message)]
        pub fn board(&self) -> Vec<Option<AccountId>> {
            (0..self.dimensions.y)
                .flat_map(|y| {
                    (0..self.dimensions.x).map(move |x| self.field(Field { x, y }))
                })
                .collect()
        }

        fn player_score_iter(&self) -> impl Iterator<Item = (Player, u64)> {
            let players = self.players();
            let board = self.board();
            let mut scores = BTreeMap::<AccountId, u64>::new();

            for owner in board.into_iter().flatten() {
                let entry = scores.entry(owner).or_default();
                *entry = *entry + 1;
            }

            players.into_iter().map(move |p| {
                let score = scores.get(&p.id).unwrap_or(&0);
                (p, *score)
            })
        }

        fn find_player(id: &AccountId, players: &[Player]) -> Result<usize, usize> {
            players.binary_search_by_key(id, |player| player.id)
        }

        fn player_mut<'a>(
            id: &AccountId,
            players: &'a mut [Player],
        ) -> Option<&'a mut Player> {
            Self::find_player(id, players)
                .map(|idx| &mut players[idx])
                .ok()
        }

        fn is_running(&self) -> bool {
            if let State::Running { end_block, .. } = self.state {
                self.env().block_number() < end_block
            } else {
                false
            }
        }

        fn idx(&self, coord: &Field) -> u32 {
            coord.x + coord.y * self.dimensions.x
        }

        fn is_valid_coord(&self, coord: &Field) -> bool {
            self.idx(coord) < self.dimensions.x * self.dimensions.y
        }
    }
}
