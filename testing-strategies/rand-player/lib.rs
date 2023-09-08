//! This contract implements a random player that paints fields randomly.

#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod rand_player {
    #[ink(storage)]
    pub struct RandPlayer {
        dimensions: (u32, u32),
    }

    impl RandPlayer {
        #[ink(constructor)]
        pub fn new(dimensions: (u32, u32)) -> Self {
            Self { dimensions }
        }

        #[ink(message, selector = 0)]
        pub fn my_turn(&mut self) -> Option<(u32, u32)> {
            let random = self.get_random_number();
            let width = self.dimensions.0;
            let height = self.dimensions.1;

            Some((random % width, (random / width) % height))
        }

        // We treat the block timestamp as a random seed. Additionally, we take a SHA2 hash of it,
        // and take a product over the bytes of the hash.
        fn get_random_number(&self) -> u32 {
            // Timestamp is a pretty decent seed.
            let seed = self.env().block_timestamp().to_be_bytes();
            self.env()
                // In order to have scattered results, we hash the seed. Otherwise, consecutive
                // calls to `get_random_number` might return similar results.
                .hash_bytes::<ink::env::hash::Sha2x256>(&seed)
                .into_iter()
                // We take a product to enlarge result value from `u8` range a bit.
                .map(|b| (b as u32).max(1))
                .product()
        }
    }
}
