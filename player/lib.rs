#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod player {
    #[ink(storage)]
    pub struct Player {
        turn: (u32, u32)
    }

    impl Player {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                turn: (0, 0)
            }
        }

        /// A function with selector `0` always needs to be exposed by a player.
        /// This is the function that will be called during every game round.
        ///
        /// `&mut self` is important, so that players can retain state if
        /// they want to.
        #[ink(message, selector = 0)]
        pub fn your_turn(&mut self) -> (u32, u32) {
            self.turn
        }
    }
}
