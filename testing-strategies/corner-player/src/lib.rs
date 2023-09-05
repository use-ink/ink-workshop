#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod corner_player {
    #[ink(storage)]
    pub struct CornerPlayer {
        dimensions: (u32, u32),
        last: u32,
    }

    impl CornerPlayer {
        #[ink(constructor)]
        pub fn new(dimensions: (u32, u32)) -> Self {
            Self {
                dimensions,
                last: dimensions.0 * dimensions.1,
            }
        }

        #[ink(message, selector = 0)]
        pub fn my_turn(&mut self) -> Option<(u32, u32)> {
            let now = self.last - 1;
            self.last = now;

            let width = self.dimensions.0;
            Some((now % width, now / width))
        }
    }
}
