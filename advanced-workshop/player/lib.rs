#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod player {
    use ink::env::call::FromAccountId;
    use squink_splash::{
        Field,
        Game,
        GameInfo,
    };

    #[ink(storage)]
    pub struct Player {
        game: Game,
        dimensions: Field,
        seed: u32,
    }

    impl Player {
        #[ink(constructor)]
        pub fn new(game: AccountId) -> Self {
            let game = Game::from_account_id(game);
            Self {
                dimensions: game.dimensions(),
                seed: Self::env().block_number(),
                game,
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
        pub fn your_turn(&mut self, info: GameInfo) -> Option<Field> {
            // self.game.field(Field { x: 0, x: 1 }) -> check if a square is painted

            Some(Field { x: 0, y: 0 })
        }
    }
}
