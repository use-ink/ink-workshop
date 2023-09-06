use ink_e2e::build_message;

use crate::my_player::MyPlayerRef;

type E2EResult<T> = Result<T, Box<dyn std::error::Error>>;

#[ink_e2e::test]
fn instantiation_works(mut client: Client) -> E2EResult<()> {
    let _contract = client
        .instantiate(
            "my-player",
            &ink_e2e::alice(),
            MyPlayerRef::new((10, 10), 1),
            0,
            None,
        )
        .await
        .expect("Failed to instantiate contract");

    Ok(())
}

#[ink_e2e::test]
fn uses_dummy_strategy_correctly(mut client: Client) -> E2EResult<()> {
    const DIMENSION: u32 = 4;
    const START: u32 = 1;

    let player_address = client
        .instantiate(
            "my-player",
            &ink_e2e::alice(),
            MyPlayerRef::new((DIMENSION, DIMENSION), START),
            0,
            None,
        )
        .await
        .expect("Failed to instantiate contract")
        .account_id;

    let call = build_message::<MyPlayerRef>(player_address).call(|player| player.my_turn());

    for turn in START..(DIMENSION * DIMENSION) + START {
        let result = client
            .call(&ink_e2e::alice(), call.clone(), 0, None)
            .await
            .expect("Failed to get coordinates");

        if let Some((x, y)) = result.return_value() {
            assert_eq!(x, turn % DIMENSION);
            assert_eq!(y, turn / DIMENSION % DIMENSION);
        } else {
            panic!("Should have returned coordinates")
        }
    }

    Ok(())
}
