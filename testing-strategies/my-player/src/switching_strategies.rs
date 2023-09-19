//! Recently, we've been working on integrating drink! library into ink!'s E2E testing framework.
//! While it's still missing some minor features, it is already possible to easily switch between
//! E2E and quasi-E2E testing strategies without any need of changing testcase code.

use ink_e2e::E2EBackend;

use crate::my_player::{MyPlayer, MyPlayerRef};

type E2EResult<T> = Result<T, Box<dyn std::error::Error>>;

pub const DIMENSION: u32 = 4;
pub const START: u32 = 1;
const GAS_EXCESS: Option<usize> = Some(10);

// We can run a testcase in a normal E2E flavour, just like we did in `e2e_tests` module.
#[ink_e2e::test]
fn work_with_full_stack(mut client: Client) -> E2EResult<()> {
    uses_dummy_strategy_correctly(client).await
}

// But also we can run it in a quasi-E2E flavour. This means that beneath we will be using drink!
// library instead of a running node.
#[ink_e2e::test(backend = "runtime-only")]
fn work_without_node(mut client: Client) -> E2EResult<()> {
    uses_dummy_strategy_correctly(client).await
}

async fn uses_dummy_strategy_correctly<Client: E2EBackend>(mut client: Client) -> E2EResult<()> {
    let player = client
        .instantiate(
            "my-player",
            &ink_e2e::alice(),
            MyPlayerRef::new((DIMENSION, DIMENSION), START),
            0,
            None,
        )
        .await
        .map_err(|_| "Failed to instantiate player")?;

    let mut call_builder = player.call::<MyPlayer>();

    for turn in START..(DIMENSION * DIMENSION) + START {
        let result = client
            .call(&ink_e2e::alice(), &call_builder.my_turn(), 0, GAS_EXCESS, None)
            .await
            .map_err(|_| "Failed to call player")?;

        if let Some((x, y)) = result.return_value() {
            assert_eq!(x, turn % DIMENSION);
            assert_eq!(y, turn / DIMENSION % DIMENSION);
        } else {
            panic!("Should have returned coordinates")
        }
    }

    Ok(())
}
