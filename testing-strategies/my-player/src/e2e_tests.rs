use ink_e2e::build_message;
use squink_splash::{Field, Game as GameRef};

use crate::my_player::MyPlayerRef;

type E2EResult<T> = Result<T, Box<dyn std::error::Error>>;

const DIMENSION: u32 = 4;
const START: u32 = 1;

#[ink_e2e::test]
fn instantiation_works(mut client: Client) -> E2EResult<()> {
    let _ = client
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

#[ink_e2e::test(additional_contracts = "../../game/Cargo.toml")]
fn we_can_simulate_one_player_game(mut client: Client) -> E2EResult<()> {
    let dimensions = Field {
        x: DIMENSION,
        y: DIMENSION,
    };
    let forming_rounds = 0;
    let rounds = 10;
    let buy_in = 0;
    let caller = ink_e2e::alice();

    let player_address = client
        .instantiate(
            "my-player",
            &caller,
            MyPlayerRef::new((DIMENSION, DIMENSION), START),
            0,
            None,
        )
        .await
        .expect("Failed to instantiate contract")
        .account_id;

    let game_address = client
        .instantiate(
            "squink_splash",
            &caller,
            GameRef::new(dimensions, buy_in, forming_rounds, rounds),
            0,
            None,
        )
        .await
        .expect("Failed to instantiate contract")
        .account_id;

    client
        .call(
            &caller,
            build_message::<GameRef>(game_address)
                .call(|c| c.register_player(player_address, "Player 1".into())),
            0,
            None,
        )
        .await
        .unwrap();

    client
        .call(
            &caller,
            build_message::<GameRef>(game_address).call(|c| c.start_game()),
            0,
            None,
        )
        .await
        .unwrap();

    // XDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
    client
        .call(
            &caller,
            build_message::<GameRef>(game_address).call(|c| c.state()),
            0,
            None,
        )
        .await
        .unwrap();

    for _ in 0..rounds {
        client
            .call(
                &caller,
                build_message::<GameRef>(game_address).call(|c| c.submit_turn()),
                0,
                None,
            )
            .await
            .map_err(|e| println!("{:?}", e))
            .unwrap();

        client
            .call(
                &caller,
                build_message::<GameRef>(game_address).call(|c| c.state()),
                0,
                None,
            )
            .await
            .unwrap();
    }

    client
        .call(
            &caller,
            build_message::<GameRef>(game_address).call(|c| c.end_game()),
            0,
            None,
        )
        .await
        .unwrap();

    Ok(())
}
