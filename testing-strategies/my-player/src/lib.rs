#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[cfg(all(test, feature = "unit-tests"))]
mod unit_tests;

#[ink::contract]
mod my_player {
    #[ink(storage)]
    pub struct MyPlayer {
        dimensions: (u32, u32),
        next_turn: u32,
    }

    impl MyPlayer {
        #[ink(constructor)]
        pub fn new(dimensions: (u32, u32), start: u32) -> Self {
            Self {
                dimensions,
                next_turn: start,
            }
        }

        #[ink(message, selector = 0)]
        pub fn my_turn(&mut self) -> Option<(u32, u32)> {
            let turn = self.next_turn;
            self.next_turn += 1;
            Some((turn % self.dimensions.0, turn / self.dimensions.0))
        }
    }
}
