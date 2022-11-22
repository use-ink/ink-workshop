#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod player {
    use game::{Field, SquinkSplashRef};
    use ink::env::call::FromAccountId;

    #[ink(storage)]
    pub struct Player {
        game: SquinkSplashRef,
        dimensions: Field,
        seed: u32,
    }

    impl Player {
        #[ink(constructor)]
        pub fn new(game: AccountId) -> Self {
            let game = SquinkSplashRef::from_account_id(game);
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
        pub fn your_turn(&mut self) -> Field {
            let size = self.dimensions.x * self.dimensions.y;
            for i in 0..size {
                let idx = (i + self.seed) % size;
                let turn = Field {
                    x: idx % self.dimensions.x,
                    y: idx / self.dimensions.x,
                };
                if self.game.field(turn).is_none() {
                    return turn;
                }
            }
            Field { x: 0, y: 0 }
        }
    }
}
