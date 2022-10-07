#![cfg_attr(not(feature = "std"), no_std)]

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
    };

    /// The amount of players that are allowed to register for a single game.
    const PLAYER_LIMIT: usize = 25;

    /// Maximum number of bytes in a players name.
    const ALLOWED_NAME_SIZES: RangeInclusive<usize> = 3..=12;

    /// How much score should be addded per field that is occupied by a user.
    const SCORE_PER_FIELD: u64 = 1_000_000_000;

    #[ink(storage)]
    pub struct SquinkSplash {
        /// Owner of the contract. Can initiate a new game.
        admin: AccountId,
        /// In which game phase is this contract.
        state: State,
        /// List of fields with their owner (if any).
        board: Mapping<u32, AccountId>,
        /// Width and height of the board.
        dimensions: (u32, u32),
        /// List of all players.
        players: Lazy<Vec<Player>>,
        /// The amount of balance that needs to be payed to join the game.
        buy_in: Balance,
    }

    #[derive(scale::Decode, scale::Encode, Clone)]
    #[cfg_attr(
        feature = "std",
        derive(Debug, scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub enum State {
        Forming,
        Running { end_block: u32 },
        Finished { winner: AccountId },
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
        /// TODO: This is not used yet.
        storage_used: u32,
        last_turn: u32,
    }

    /// A player attempted to make a turn.
    #[ink(event)]
    pub struct TurnTaken {
        /// The player that attempted the turn.
        player: AccountId,
        /// The field that was painted by the player.
        ///
        /// This is `None` if the turn failed. This will happen if the player's contract
        /// fails to return a proper turn.
        turn: Option<(u32, u32)>,
    }

    impl SquinkSplash {
        /// Create a new game.
        #[ink(constructor)]
        pub fn new(dimensions: (u32, u32), buy_in: Balance) -> Self {
            let mut ret = Self {
                admin: Self::env().caller(),
                state: State::Forming,
                board: Default::default(),
                dimensions,
                players: Default::default(),
                buy_in,
            };
            ret.players.set(&Vec::new());
            ret
        }

        /// When the game is in finished the contract can be deleted by the admin.
        #[ink(message)]
        pub fn destroy(&mut self) {
            assert_eq!(self.admin, self.env().caller(), "Only admin can call this.");
            if let State::Finished { .. } = self.state {
                self.env().terminate_contract(self.admin)
            } else {
                panic!("Only finished games can be destroyed.")
            }
        }

        /// The admin can start the game.
        #[ink(message)]
        pub fn start_game(&mut self, rounds: u32) {
            assert_eq!(self.admin, self.env().caller(), "Only admin can call this.");
            assert!(
                matches!(self.state, State::Forming),
                "Game already started."
            );
            let players = self.players();
            assert!(!players.is_empty(), "You need at least one player.");
            let start_block = self.env().block_number();
            let end_block = start_block + rounds;
            self.state = State::Running { end_block };
        }

        /// When enough time has passed no new turns can be submitted.
        /// Then everybody can call this to end the game and trigger the payout to
        /// the winner.
        #[ink(message)]
        pub fn end_game(&mut self) {
            match self.state {
                State::Running { end_block }
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

                    self.state = State::Finished { winner }
                }
                _ => panic!("Game can't be ended or has already ended."),
            }
        }

        /// Add a new player to the game. Only allowed while the game has not started.
        #[ink(message, payable)]
        pub fn register_player(&mut self, id: AccountId, name: String) {
            assert!(
                matches!(self.state, State::Forming),
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
                            storage_used: 0,
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

            // We need to call with reentrancy enabled to allow those contracts to query us.
            let call = build_call::<DefaultEnvironment>()
                .call_type(Call::new().callee(player.id))
                .exec_input(ExecutionInput::new(Selector::from([0x00; 4])))
                .call_flags(CallFlags::default().set_allow_reentry(true))
                .returns::<(u32, u32)>();

            let gas_before = self.env().gas_left();
            let turn = call.fire();
            player.gas_used += gas_before - self.env().gas_left();

            // We don't bubble up the error cause we still want to record the gas usage
            // and disallow another try. This should be enough punishment for a defunct contract.
            match &turn {
                Ok((x, y)) => {
                    // Just overpaint. Overpainting is the best case cause it steals points.
                    self.board.insert(self.idx(*x, *y), &player.id);
                    ink::env::debug_println!("Player painted: x={:03} y={:03}", x, y);
                }
                Err(err) => {
                    ink::env::debug_println!("Contract failed to make a turn: {:?}", err);
                }
            }

            self.env().emit_event(TurnTaken {
                player: player.id,
                turn: turn.ok(),
            });

            self.players.set(&players);
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
        pub fn dimensions(&self) -> (u32, u32) {
            self.dimensions
        }

        /// Returns the value (owner) of the supplied field.
        #[ink(message)]
        pub fn field(&self, x: u32, y: u32) -> Option<AccountId> {
            self.board.get(self.idx(x, y))
        }

        /// Returns the complete board.
        ///
        /// The index into the vector is calculated as `x + y * width`.
        #[ink(message)]
        pub fn board(&self) -> Vec<Option<AccountId>> {
            let (width, height) = self.dimensions;
            (0..height)
                .flat_map(|y| (0..width).map(move |x| self.field(x, y)))
                .collect()
        }

        fn player_score_iter(&self) -> impl Iterator<Item = (Player, u64)> {
            let players = self.players();
            let board = self.board();
            let mut scores = BTreeMap::<AccountId, u64>::new();

            for owner in board.into_iter().flatten() {
                let entry = scores.entry(owner).or_default();
                *entry = entry.saturating_add(SCORE_PER_FIELD);
            }

            players.into_iter().map(move |p| {
                let score = scores
                    .get(&p.id)
                    .unwrap_or(&0)
                    .saturating_sub(p.gas_used)
                    .saturating_sub(p.storage_used.into());
                (p, score)
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
            if let State::Running { end_block } = self.state {
                self.env().block_number() < end_block
            } else {
                false
            }
        }

        fn idx(&self, x: u32, y: u32) -> u32 {
            let (width, _height) = self.dimensions;
            x + y * width
        }
    }
}
