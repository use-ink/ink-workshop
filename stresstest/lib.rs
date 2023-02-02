#![cfg_attr(not(feature = "std"), no_std)]

pub use player::PlayerRef as TestPlayer;

#[ink::contract]
mod player {
    #[ink(storage)]
    pub struct Player {
        dimensions: (u32, u32),
        seed: u32,
    }

    impl Player {
        #[ink(constructor)]
        pub fn new(dimensions: (u32, u32), seed: u32) -> Self {
            Self {
                dimensions,
                seed,
            }
        }

        /// This is the function that will be called during every game round.
        ///
        /// The function returns an `(x, y)` coordinate of the pixel which you
        /// want to color.
        ///
        /// # Notes
        ///
        /// The function signature `&mut self` is so that you can retain state
        /// in the contract's storage if you want to.
        ///
        /// The function can be named as you like, but it always needs to have
        /// a defined selector of `0`.
        #[ink(message, selector = 0)]
        pub fn your_turn(&mut self) -> Option<(u32, u32)> {
            use rand::{SeedableRng, RngCore, rngs::SmallRng};

            let mut small_rng = SmallRng::seed_from_u64(self.seed.into());
            let x = small_rng.next_u32() % self.dimensions.0;
            let y = small_rng.next_u32() % self.dimensions.1;

            self.seed = small_rng.next_u32();

            Some((x, y))
        }
    }
}
