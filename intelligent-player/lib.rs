#![cfg_attr(not(feature = "std"), no_std)]

pub use player::PlayerRef as TestPlayer;

#[ink::contract]
mod player {
    use ink::prelude::vec::Vec;
    use ink::env::{
        DefaultEnvironment,
        call::{build_call, Selector, ExecutionInput},
    };
    use rand::{SeedableRng, RngCore, rngs::SmallRng};

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


    #[ink(storage)]
    pub struct Player {
        dimensions: Field,
        game_addr: AccountId,
        seed: u32,
    }

    impl Player {
        #[ink(constructor)]
        pub fn new(game_addr: AccountId, seed: u32) -> Self {
            let dimensions: Field = build_call::<DefaultEnvironment>()
                .call(game_addr)
                .exec_input(
                    ExecutionInput::new(Selector::new(0xf10dee95_u32.to_be_bytes()))
                )
                .returns::<Field>()
                .invoke();

            Self {
                dimensions,
                game_addr,
                seed
            }
        }

        /// Cross-contract call for the board and start at a random point
        /// to look through it for free cells.
        #[ink(message, selector = 0)]
        pub fn your_turn(&mut self) -> Option<(u32, u32)> {
            let board: Vec<Option<FieldEntry>> = build_call::<DefaultEnvironment>()
                 .call(self.game_addr)
                 .exec_input(
                     ExecutionInput::new(Selector::new(0x276086cb_u32.to_be_bytes()))
                 )
                 .returns::<Vec<Option<FieldEntry>>>()
                 .invoke();

            // Choose random starting point
            let mut small_rng = SmallRng::seed_from_u64(self.seed.into());
            let starting_pointer: usize = small_rng.next_u32() as usize % board.len();

            self.seed = small_rng.next_u32();

            // The index into the vector is calculated as `x + y * width`.
            let width = self.dimensions.x as usize;
            let height = self.dimensions.y as usize;

            // The cells in the `board` vec are stored as `board[x + y * width]`.
            for pointer in starting_pointer..height*width as usize {
                if board[pointer].is_none() {
                    let x = pointer % width;
                    let y = pointer / width;
                    return Some((x as u32, y as u32))
                }
            }

            // We didn't find an empty field in the above search, let's
            // look in the part of the vec that we didn't examine yet.
            for pointer in 0..starting_pointer as usize {
                if board[pointer].is_none() {
                    let x = pointer % width;
                    let y = pointer / width;
                    return Some((x as u32, y as u32))
                }
            }

            None
        }
    }
}
