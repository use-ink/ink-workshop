#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod player {
    #[ink(storage)]
    pub struct Player {}

    impl Player {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {}
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
        pub fn your_turn(&mut self) -> (u32, u32) {
            // =======================================================
            // TODO: Add your custom logic here...
            // =======================================================
            (0, 0)
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[test]
        fn works() {
            // given
            let mut contract = Player::new();

            // when
            let turn = contract.your_turn();

            // then
            assert_eq!(turn, (0, 0));
        }
    }
}
