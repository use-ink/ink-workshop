#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod game {
    use ink::{
        env::{
            call::{
                build_call,
                Call,
                ExecutionInput,
                Selector,
            },
            DefaultEnvironment,
        },
        prelude::vec::Vec,
        storage::Mapping,
    };

    type Gas = u64;
    type Width = u32;
    type Height = u32;
    type X = u32;
    type Y = u32;

    type PlayerId = AccountId;
    type Score = u32;

    // What each player returns for each round.
    type PlayerTurn = (X, Y);

    // We keep a gas allowance:
    //   * During each round this is how much gas a player has available.
    //   * During each round each player gets additional `GAS_CREDITS` added
    //     to their allowance. This is on top of what they haven't spent last
    //     time.
    //   * The value can also be negative, there are penalties for e.g.
    //     over-painting pixels.
    type GasAllowance = i32;

    // The amount of gas allowance each player gets credited with each round.
    const GAS_ALLOWANCE_PER_ROUND: i32 = 750_000_000;

    #[ink(storage)]
    pub struct Game {
        /// Privileged account to control the game.
        admin: AccountId,
        /// Mapping of all players.
        players: Mapping<AccountId, Player>,
        /// Vector with all players, since we can't iterate over the `players` `Mapping`.
        all_players: Vec<AccountId>,
        /// Individual pixels with information about who painted them.
        pixels: Mapping<(X, Y), Pixel>,
        /// Playground width.
        width: Width,
        /// Playground height.
        height: Height,
        /// Keeps track of each players score.
        _scoreboard: Mapping<PlayerId, Score>,
    }

    #[derive(scale::Decode, scale::Encode)]
    #[cfg_attr(
        feature = "std",
        derive(
            Debug,
            PartialEq,
            Eq,
            scale_info::TypeInfo,
            ink::storage::traits::StorageLayout
        )
    )]
    struct Player {
        id: PlayerId,
        gas_balance: GasAllowance,
    }

    #[derive(Default, scale::Encode, scale::Decode, Eq, PartialEq)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    struct Pixel {
        owner: Option<PlayerId>,
    }

    #[ink(event)]
    pub struct Scoreboard {
        scoreboard: Vec<(PlayerId, Score)>,
    }

    #[ink(event)]
    #[derive(Debug)]
    pub struct PaintedPixel {
        player: AccountId,
        pixel: (X, Y),
    }

    impl Game {
        /// Set up a new game.
        #[ink(constructor)]
        pub fn new(admin: Option<AccountId>, width: Width, height: Height) -> Self {
            // enable re-entrancy
            let admin = admin.unwrap_or_else(|| Self::env().account_id());
            Self {
                admin,
                players: Mapping::new(),
                all_players: Vec::new(),
                pixels: Mapping::new(),
                width,
                height,
                _scoreboard: Mapping::new(),
            }
        }

        /// Registers a new player.
        #[ink(message)]
        pub fn register_player(&mut self, id: PlayerId) {
            // TODO we should penalize the player if it's already registered.
            self.players.insert(id, &Player { id, gas_balance: 0 });

            let mut all_players = self.all_players.clone();
            all_players.push(id);
            self.all_players = all_players;
        }

        /// Executes a new round in the game.
        ///
        /// Emits an event for every painted pixel.
        #[ink(message)]
        pub fn execute_turns(&mut self) {
            self.env().emit_event(PaintedPixel {
                player: self.env().caller(),
                pixel: (1337, 4221),
            });

            let all_players = self.all_players.clone();
            // TODO the block time on Rococo is 12 seconds, we should increase
            // the loop value below to play 24 rounds, so that the frontend
            // can display a new round every 0.5 seconds, resulting in a nice
            // animation. I've set it to 1 for now, as the gas fees get to high
            // otherwise.
            for _round in 0..1 {
                for player_id in &all_players {
                    let mut player = self.players.get(player_id).expect("must exist");
                    self.process_round_for_player(&mut player);
                    self.players.insert(player.id, &player);
                }
            }
        }

        /// Plays one round for the given `player`.
        fn process_round_for_player(&mut self, player: &mut Player) {
            // for each round each player gets a certain gas balance credited
            player.gas_balance = player.gas_balance + GAS_ALLOWANCE_PER_ROUND;
            let max_gas = player.gas_balance;

            let gas_left_before = self.env().gas_left();
            let (x, y) = self.fetch_player_turn(&player, max_gas as Gas);
            let gas_left_after = self.env().gas_left();

            let gas_used = gas_left_before - gas_left_after;
            player.gas_balance = player.gas_balance - gas_used as GasAllowance;

            // penalize the player if they try to paint a pixel out of bounds
            if x >= self.width || y >= self.height {
                player.gas_balance = player.gas_balance
                    - (GAS_ALLOWANCE_PER_ROUND as f32 * 0.1) as GasAllowance;
                return
            }

            if let Some(mut pixel) = self.pixels.get((x, y)) {
                match pixel.owner {
                    Some(owner) if owner == player.id => {
                        // penalize the player if trying to overpaint a pixel that is
                        // already owned by itself
                        player.gas_balance = player.gas_balance
                            - (GAS_ALLOWANCE_PER_ROUND as f32 * 0.5) as GasAllowance;
                    }
                    _ => {
                        // penalize the player if trying to overpaint a pixel
                        // that is already owned by someone else
                        player.gas_balance = player.gas_balance
                            - (GAS_ALLOWANCE_PER_ROUND as f32 * 0.3) as GasAllowance;
                    }
                }

                // if there is some positive gas balance left we mark
                // the player as the new owner of the pixel
                if player.gas_balance > 0 {
                    pixel.owner = Some(player.id);
                    self.pixels.insert((x, y), &pixel);
                    self.env().emit_event(PaintedPixel {
                        player: player.id,
                        pixel: (x, y),
                    });
                }
            } else {
                let owner = if player.gas_balance > 0 {
                    Some(player.id)
                } else {
                    None
                };

                self.pixels.insert((x, y), &Pixel { owner });
                self.env().emit_event(PaintedPixel {
                    player: player.id,
                    pixel: (x, y),
                });
            }
        }

        /// Executes a cross-contract call to a player in order to
        /// fetch the pixel that the player wants to paint.
        fn fetch_player_turn(&self, player: &Player, max_gas: Gas) -> PlayerTurn {
            ink::env::debug_println!("calling player {:?}", player.id);
            ink::env::debug_println!("max gas {:?}", max_gas);
            let ret: PlayerTurn = build_call::<DefaultEnvironment>()
                .call_type(Call::new().callee(player.id))
                //.gas_limit(max_gas)
                // for some reason the cross-contract call currently only runs
                // with `gas_limit = 0`.
                .gas_limit(0)
                .exec_input(ExecutionInput::new(Selector::from([0x00; 4])))
                .returns::<PlayerTurn>()
                .fire()
                .unwrap_or_else(|err| {
                    panic!("error during cross-contract call: {:?}", err)
                });
            ret
        }

        /// Returns the dimension of the playground.
        #[ink(message)]
        pub fn get_dimensions(&self) -> (Width, Height) {
            (self.width, self.height)
        }
    }
}
