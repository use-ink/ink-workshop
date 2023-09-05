use crate::my_player::MyPlayer;

#[ink::test]
fn instantiation_works() {
    let _player = MyPlayer::new((10, 10), 1);
}

#[ink::test]
fn uses_dummy_strategy_correctly() {
    check_dummy_playing::<1, 10, 0>();
    check_dummy_playing::<10, 10, 1>();
    check_dummy_playing::<2, 2, 14>();
    check_dummy_playing::<41, 3, 2>();
    check_dummy_playing::<3, 14, { 3 * 14 }>();
}

fn check_dummy_playing<const WIDTH: u32, const HEIGHT: u32, const START: u32>() {
    let mut player = MyPlayer::new((WIDTH, HEIGHT), START);

    for turn in START..(HEIGHT * WIDTH) + START {
        let (x, y) = player.my_turn().expect("should return coordinates");
        assert_eq!(x, turn % WIDTH);
        assert_eq!(y, turn / WIDTH);
    }
}
