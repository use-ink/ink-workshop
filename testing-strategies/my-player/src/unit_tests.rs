//! Unit tests are the simplest ones to write and run. They are also the fastest. However, remember
//! that everything here happens off-chain, without any runtime context around. In particular, we
//! cannot test our strategy against other players, or even check compatibility with the game
//! contract. On the other hand, the code does not need any additional overhead and it looks just
//! like a standard Rust component test.

use crate::my_player::MyPlayer;

/// We are checking that the instantiation of the `MyPlayer` contract succeeds.
///
/// Notice that we are using a special test marker: `ink::test`. It will build a contract in a
/// proper way to be used in unit testing. Also, it will provide an off-chain contract engine for
/// the interaction.
#[ink::test]
fn instantiation_works() {
    let player = MyPlayer::new((10, 10), 1);
    assert_eq!(player.dimensions, (10, 10));
    assert_eq!(player.next_turn, 1);
}

/// We can also check that our player indeed follows the assumed strategy on different board sizes
/// and different starting turns.
#[ink::test]
fn uses_dummy_strategy_correctly() {
    check_dummy_playing::<1, 10, 0>();
    check_dummy_playing::<10, 10, 1>();
    check_dummy_playing::<2, 2, 14>();
    check_dummy_playing::<41, 3, 2>();
    check_dummy_playing::<3, 14, { 3 * 14 }>();
}

/// This is a helper function that checks that the player follows the dummy strategy correctly.
///
/// We simulate a full game, i.e. that many rounds as there are fields on the board. We check that
/// the player returns the correct coordinates for each turn.
fn check_dummy_playing<const WIDTH: u32, const HEIGHT: u32, const START: u32>() {
    let mut player = MyPlayer::new((WIDTH, HEIGHT), START);

    for turn in START..(HEIGHT * WIDTH) + START {
        let (x, y) = player.my_turn().expect("should return coordinates");
        assert_eq!(x, turn % WIDTH);
        assert_eq!(y, turn / WIDTH % HEIGHT);
    }
}
