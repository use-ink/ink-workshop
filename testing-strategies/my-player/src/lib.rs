//! This contract implements a simple player that paints fields from left to right and top to
//! bottom.

#![cfg_attr(not(feature = "std"), no_std, no_main)]

extern crate core;

#[cfg(all(test, feature = "drink-tests"))]
mod drink_tests;
#[cfg(all(test, feature = "e2e-tests"))]
mod e2e_tests;
#[cfg(all(test, feature = "unit-tests"))]
mod unit_tests;

#[ink::contract]
mod my_player {
    #[ink(storage)]
    pub struct MyPlayer {
        pub dimensions: (u32, u32),
        pub next_turn: u32,
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
            Some((
                // width coordinate
                turn % self.dimensions.0,
                // height coordinate
                (turn / self.dimensions.0) % self.dimensions.1,
            ))
        }
    }
}
