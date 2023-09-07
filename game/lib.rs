#![cfg_attr(not(feature = "std"), no_std, no_main)]

pub use contract::{
    Field,
    FieldEntry,
    GameInfo,
    SquinkSplashRef as Game,
    State,
};

#[ink::contract]
mod contract {
    use core::{
        cmp::Reverse,
        ops::RangeInclusive,
    };
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
            string::String,
            vec::Vec,
        },
        storage::{
            Lazy,
            Mapping,
        },
    };

    /// The amount of players that are allowed to register for a single game.
    const PLAYER_LIMIT: usize = 80;

    /// The amount of gas we want to allocate to all players within one turn.
    ///
    /// Should be smaller than the maximum extrinsic weight since we also need to account
    /// for the overhead of the game contract itself.
    const GAS_LIMIT_ALL_PLAYERS: u64 = 250_000_000_000;

    /// Maximum number of bytes in a players name.
    const ALLOWED_NAME_SIZES: RangeInclusive<usize> = 3..=16;

    #[ink(storage)]
    pub struct SquinkSplash {
        /// In which game phase is this contract.
        state: State,
        /// List of fields with their owner (if any).
        board: Mapping<u32, FieldEntry>,
        /// Width and height of the board.
        dimensions: Field,
        /// List of all players.
        players: Lazy<Vec<Player>>,
        /// The amount of balance that needs to be payed to join the game.
        buy_in: Balance,
        /// The amount of blocks that this game is played for once it started.
        rounds: u32,
        /// The block number the last turn was made.
        last_turn: Lazy<u32>,
        /// The opener is allowed to start the game early.
        opener: AccountId,
    }

    #[derive(scale::Decode, scale::Encode)]
    #[cfg_attr(
        feature = "std",
        derive(Debug, scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct GameInfo {
        rounds_played: u32,
        gas_left: u64,
        player_scores: Vec<(String, u64)>,
    }

    /// The game can be in different states over its lifetime.
    #[derive(scale::Decode, scale::Encode, Clone, Debug)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
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
            /// The number of rounds that are already played in the current game.
            rounds_played: u32,
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

    #[derive(scale::Decode, scale::Encode, Debug)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct Player {
        pub id: AccountId,
        pub name: String,
        pub gas_used: u64,
        pub score: u64,
    }

    impl Player {
        /// Return the key to sort by (winner is min value by this order)
        fn scoring_order(&self) -> impl Ord {
            (Reverse(self.score), self.gas_used)
        }
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

    impl Field {
        fn len(&self) -> u32 {
            self.x * self.y
        }
    }

    /// Info for each occupied board entry.
    #[derive(scale::Decode, scale::Encode, Debug)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct FieldEntry {
        /// Player to claimed the field.
        owner: AccountId,
        /// The round in which the field was claimed.
        claimed_at: u32,
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
        /// Player contract failed to return a result. This happens if it
        /// panicked, ran out of gas, returns garbage or is not even a contract.
        BrokenPlayer,
        /// Player decided to not make a turn and hence was charged no gas.
        NoTurn,
        /// Contract doesn't have any budget left and isn't called anymore.
        BudgetExhausted,
    }

    /// A player joined the game by calling [`register_player`].
    #[ink(event)]
    pub struct PlayerRegistered {
        /// The player contract account ID.
        player: AccountId,
    }

    /// The rounds played have increased. This is used for the client side to keep
    /// the [`TurnTaken`] events and "Blocks" UI in sync. Events are emitted before
    /// block number changes, so re-fetching [`rounds_played`] on a block change
    /// causes a brief delay in the UI.
    #[ink(event)]
    pub struct RoundIncremented {
        /// The number of rounds played.
        rounds_played: u32,
    }

    /// Someone started the game by calling [`start_game`].
    #[ink(event)]
    pub struct GameStarted {
        /// The account start called [`start_game`].
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

    /// Someone ended the game by calling [`end_game`].
    ///
    /// This event doesn't contain information about the winner because the contract still
    /// exists. Interested parties can read this information from the contract by calling
    /// [`state`] and [`player_scores`].
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
    }

    impl SquinkSplash {
        /// Create a new game.
        ///
        /// - `dimensions`: (width, height) of the board.
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
                last_turn: Default::default(),
                opener: Self::env().caller(),
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
                    Self::env().caller(),
                    "Only winner is allowed to destroy the contract."
                );
                let winner = {
                    let players = self.players();
                    let winning_idx = Self::find_player(&winner, &players)
                        .expect("The winner is a player; qed");
                    players.into_iter().nth(winning_idx).unwrap()
                };
                let winner_id = winner.id.clone();
                Self::env().emit_event(GameDestroyed { winner });
                Self::env().terminate_contract(winner_id)
            } else {
                panic!("Only finished games can be destroyed.")
            }
        }

        /// Anyone can start the game when `earliest_start` is reached.
        #[ink(message)]
        pub fn start_game(&mut self) {
            if let State::Forming { earliest_start } = self.state {
                assert!(
                    Self::env().caller() == self.opener
                        || Self::env().block_number() >= earliest_start,
                    "Game can't be started, yet."
                );
            } else {
                panic!("Game already started.")
            };
            let players = self.players();
            assert!(!players.is_empty(), "You need at least one player.");
            self.state = State::Running { rounds_played: 0 };

            // We pretend that there was already a turn in this block so that no
            // turns can be submitted in the same block as when the game is started.
            self.last_turn.set(&Self::env().block_number());
            Self::env().emit_event(GameStarted {
                starter: Self::env().caller(),
            });
        }

        /// When enough time has passed, no new turns can be submitted.
        /// Then anybody may call this function to end the game and
        /// trigger the payout to the winner.
        #[ink(message)]
        pub fn end_game(&mut self) {
            assert!(
                !self.is_running(),
                "Game can't be ended or has already ended.",
            );

            let players = self.players();
            let winner = players
                .iter()
                .min_by_key(|p| p.scoring_order())
                .expect("We only allow starting the game with at least 1 player.")
                .id;

            // Give the pot to the winner
            Self::env()
                .transfer(winner, Balance::from(players.len() as u32) * self.buy_in)
                .unwrap();

            self.state = State::Finished { winner };
            Self::env().emit_event(GameEnded {
                ender: Self::env().caller(),
            });
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
                Self::env().transferred_value(),
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
                            score: 0,
                        },
                    );
                    self.players.set(&players);
                    Self::env().emit_event(PlayerRegistered { player: id });
                }
                Ok(_) => panic!("Player already registered."),
            }
        }

        /// This is the actual game loop.
        ///
        /// It can be called by anyone and triggers at most one turn
        /// of the game per block.
        #[ink(message)]
        pub fn submit_turn(&mut self) {
            assert!(
                self.is_running(),
                "Game can't be ended or has already ended.",
            );

            let mut players = self.players();

            let State::Running { rounds_played } = &mut self.state else {
                panic!("This game does not accept turns right now.");
            };

            // Only one turn per block
            // We need to write this to storage because of reentrancy: The called contract
            // could call this function again and do another turn in the same block.
            let current_block = Self::env().block_number();
            let last_turn = self
                .last_turn
                .get()
                .expect("Value was set when starting the game.");
            assert!(
                last_turn < current_block,
                "A turn was already submitted for this block. Last turn: {} Current Block: {}",
                last_turn, current_block,
            );
            self.last_turn.set(&current_block);

            // We need to cache this as we can't accessed players in the loop.
            let num_players = players.len();

            // Batching is needed so we don't call all the players every round
            // (because of the gas limit).
            let current_round = *rounds_played;
            *rounds_played += 1;
            let num_batches = Self::calc_num_batches(num_players);
            let current_batch = current_round % num_batches;

            // Information about the game is passed to players.
            let mut game_info = GameInfo {
                rounds_played: current_round,
                gas_left: 0,
                player_scores: players
                    .iter()
                    .map(|player| (player.name.clone(), player.score.clone()))
                    .collect(),
            };

            for (idx, player) in players.iter_mut().enumerate() {
                if idx as u32 % num_batches != current_batch {
                    continue
                }

                // Stop calling a contract that has no gas left.
                let gas_limit = Self::calc_gas_limit(num_players as usize);
                let gas_left = Self::calc_gas_budget(gas_limit, self.rounds)
                    .saturating_sub(player.gas_used);
                if gas_left == 0 {
                    Self::env().emit_event(TurnTaken {
                        player: player.id,
                        outcome: TurnOutcome::BudgetExhausted,
                    });
                    continue
                }
                game_info.gas_left = gas_left;

                // We need to call with reentrancy enabled to allow those
                // contracts to query us.
                let call = build_call::<DefaultEnvironment>()
                    .call_type(Call::new(player.id))
                    .gas_limit(gas_limit)
                    .exec_input(
                        ExecutionInput::new(Selector::from([0x00; 4]))
                            .push_arg(&game_info),
                    )
                    .call_flags(CallFlags::default().set_allow_reentry(true))
                    .returns::<Option<Field>>();

                let gas_before = Self::env().gas_left();
                let turn = call.try_invoke();
                let gas_used = gas_before - Self::env().gas_left();

                // We continue even if the contract call fails. If the contract
                // doesn't conform it is the players fault. No second tries.
                let outcome = match turn {
                    Ok(Ok(Some(turn))) if self.idx(&turn).is_some() => {
                        let idx = self.idx(&turn).unwrap();
                        // Player tried to make a turn: charge gas.
                        player.gas_used += gas_used;
                        if !self.is_valid_coord(&turn) {
                            TurnOutcome::OutOfBounds { turn }
                        } else {
                            if let Some(entry) = self.board.get(&idx) {
                                TurnOutcome::Occupied {
                                    turn,
                                    player: entry.owner,
                                }
                            } else {
                                self.board.insert(
                                    idx,
                                    &FieldEntry {
                                        owner: player.id,
                                        claimed_at: current_round,
                                    },
                                );
                                player.score += u64::from(current_round + 1);
                                TurnOutcome::Success { turn }
                            }
                        }
                    }
                    Ok(Ok(None)) => TurnOutcome::NoTurn,
                    err => {
                        // Player gets charged gas for failing.
                        player.gas_used += gas_used;
                        debug_println!("Contract failed to make a turn: {:?}", err);
                        TurnOutcome::BrokenPlayer
                    }
                };

                Self::env().emit_event(TurnTaken {
                    player: player.id,
                    outcome,
                });
            }

            Self::env().emit_event(RoundIncremented {
                rounds_played: current_round + 1,
            });

            self.players.set(&players);
        }

        /// The buy-in amount to register a player.
        #[ink(message)]
        pub fn buy_in_amount(&self) -> Balance {
            self.buy_in
        }

        /// The total amount of rounds this game is to be played for.
        #[ink(message)]
        pub fn total_rounds(&self) -> u32 {
            self.rounds
        }

        /// How much gas each player is allowed to use per round.
        #[ink(message)]
        pub fn gas_limit(&self) -> u64 {
            Self::calc_gas_limit(self.players().len())
        }

        /// Describes into many groups the players should be partitioned.
        ///
        /// How often [`submit_turn`] needs to be called until all players
        /// made a turn.
        #[ink(message)]
        pub fn num_batches(&self) -> u32 {
            Self::calc_num_batches(self.players().len())
        }

        /// How much gas each player is allowed to consume for the whole game.
        #[ink(message)]
        pub fn gas_budget(&self) -> u64 {
            Self::calc_gas_budget(self.gas_limit(), self.rounds)
        }

        /// The current game state.
        #[ink(message)]
        pub fn state(&self) -> State {
            self.state.clone()
        }

        /// Returns `true` if the game is running.
        #[ink(message)]
        pub fn is_running(&self) -> bool {
            if let State::Running { rounds_played, .. } = self.state {
                rounds_played < self.rounds
            } else {
                false
            }
        }

        /// List of all players sorted by score and gas costs.
        #[ink(message)]
        pub fn players_sorted(&self) -> Vec<Player> {
            let mut players = self.players();
            players.sort_unstable_by_key(|player| player.scoring_order());
            players
        }

        /// Returns the dimensions of the board.
        #[ink(message)]
        pub fn dimensions(&self) -> Field {
            self.dimensions
        }

        /// Returns the value (owner) of the supplied field.
        #[ink(message)]
        pub fn field(&self, coord: Field) -> Option<FieldEntry> {
            self.idx(&coord).and_then(|idx| self.board.get(idx))
        }

        /// Returns the complete board.
        ///
        /// The index into the vector is calculated as `x + y * width`.
        #[ink(message)]
        pub fn board(&self) -> Vec<Option<FieldEntry>> {
            self.board_iter().collect()
        }

        fn calc_gas_limit(num_players: usize) -> u64 {
            (GAS_LIMIT_ALL_PLAYERS * u64::from(Self::calc_num_batches(num_players)))
                .checked_div(num_players as u64)
                .unwrap_or(0)
        }

        fn calc_num_batches(num_players: usize) -> u32 {
            if num_players > 30 {
                2
            } else {
                1
            }
        }

        fn calc_gas_budget(gas_limit: u64, num_rounds: u32) -> u64 {
            gas_limit * u64::from(num_rounds) / 4
        }

        fn players(&self) -> Vec<Player> {
            self.players
                .get()
                .expect("Initial value is set in constructor.")
        }

        fn board_iter<'a>(&'a self) -> impl Iterator<Item = Option<FieldEntry>> + 'a {
            (0..self.dimensions.y).flat_map(move |y| {
                (0..self.dimensions.x).map(move |x| self.field(Field { x, y }))
            })
        }

        fn find_player(id: &AccountId, players: &[Player]) -> Result<usize, usize> {
            players.binary_search_by_key(id, |player| player.id)
        }

        fn idx(&self, coord: &Field) -> Option<u32> {
            coord
                .y
                .checked_mul(self.dimensions.x)
                .and_then(|val| val.checked_add(coord.x))
        }

        fn is_valid_coord(&self, coord: &Field) -> bool {
            self.idx(coord)
                .map(|val| val < self.dimensions.len())
                .unwrap_or(false)
        }
    }
}

#[cfg(all(test, feature = "e2e-tests"))]
mod tests {
    use crate::{
        Field,
        Game,
    };
    use ink_e2e::{
        alice,
        build_message,
    };
    use test_player::TestPlayer;

    #[ink_e2e::test(additional_contracts = "../test-player/Cargo.toml")]
    async fn e2e_game(mut client: Client<C, E>) {
        let alice = alice();
        let dimensions = Field { x: 10, y: 10 };
        let forming_rounds = 0;
        let rounds = 20;
        let buy_in = 0;

        let player_alex = client
            .instantiate(
                "test-player",
                &alice,
                TestPlayer::new((dimensions.x, dimensions.y), 7),
                0,
                None,
            )
            .await
            .unwrap()
            .account_id;

        let player_bob = client
            .instantiate(
                "test-player",
                &alice,
                TestPlayer::new((dimensions.x, dimensions.y), 3),
                0,
                None,
            )
            .await
            .unwrap()
            .account_id;

        let game = client
            .instantiate(
                "squink_splash",
                &alice,
                Game::new(dimensions, buy_in, forming_rounds, rounds),
                0,
                None,
            )
            .await
            .unwrap()
            .account_id;

        client
            .call(
                &alice,
                build_message::<Game>(game)
                    .call(|c| c.register_player(player_alex, "Alex".into())),
                0,
                None,
            )
            .await
            .unwrap();

        client
            .call(
                &alice,
                build_message::<Game>(game)
                    .call(|c| c.register_player(player_bob, "Bob".into())),
                0,
                None,
            )
            .await
            .unwrap();

        client
            .call(
                &alice,
                build_message::<Game>(game).call(|c| c.start_game()),
                0,
                None,
            )
            .await
            .unwrap();

        let state = client
            .call(
                &alice,
                build_message::<Game>(game).call(|c| c.state()),
                0,
                None,
            )
            .await
            .unwrap()
            .return_value();
        println!("state: {:?}", state);

        for _ in 0..rounds {
            client
                .call(
                    &alice,
                    build_message::<Game>(game).call(|c| c.submit_turn()),
                    0,
                    None,
                )
                .await
                .unwrap();

            let players = client
                .call(
                    &alice,
                    build_message::<Game>(game).call(|c| c.players_sorted()),
                    0,
                    None,
                )
                .await
                .unwrap()
                .return_value();

            println!("players: {:?}", players);
        }

        let state = client
            .call(
                &alice,
                build_message::<Game>(game).call(|c| c.state()),
                0,
                None,
            )
            .await
            .unwrap()
            .return_value();
        println!("state: {:?}", state);

        client
            .call(
                &alice,
                build_message::<Game>(game).call(|c| c.end_game()),
                0,
                None,
            )
            .await
            .unwrap();
    }
}
