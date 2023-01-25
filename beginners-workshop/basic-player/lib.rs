#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod player {
    #[ink(storage)]
    pub struct Player {
        dimensions: (u32, u32),
        start_field: u32,
    }

    impl Player {
        #[ink(constructor)]
        pub fn new(dimensions: (u32, u32), start_field: u32) -> Self {
            Self {
                dimensions,
                start_field,
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
        pub fn your_turn(&self) -> (u32, u32) {
            (0, 0)
        }
    }
}
