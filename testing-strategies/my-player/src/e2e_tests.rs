//! E2E tests harness the whole blockchain stack. For every testcase there will be a single-node
//! chain launched, where contracts will be deployed and interacted with. This is the most realistic
//! way to test your contracts, but also the slowest. Inherently, E2E tests are asynchronous. Also,
//! you must take into consideration block production/finalization times, which can be significant
//! during long simulations.
//!
//! Fortunately, by default, ink! E2E tests are using `substrate-contracts-node`, which puts every
//! transaction into a new, instantly finalized block. This makes the tests much faster, but also
//! less realistic. For example, it is harder to make few calls within a single block, or wait for
//! some blocks to pass.

use game_parameters::*;
use ink_e2e::build_message;
use squink_splash::{Game as GameRef, State};
use utils::*;

use crate::my_player::MyPlayerRef;

/// Just a type alias for the result type of E2E testcases.
type E2EResult<T> = Result<T, Box<dyn std::error::Error>>;

/// Try running tests with this set to `false`. Can you explain the results?
const CHECK_STATE_BEFORE_EVERY_TURN: bool = true;

/// We gather all game parameters in this module, so that we can easily change and access them.
mod game_parameters {
    use squink_splash::Field;

    pub const DIMENSION: u32 = 4;
    pub const START: u32 = 1;
    pub const FIELD: Field = Field {
        x: DIMENSION,
        y: DIMENSION,
    };
    pub const FORMING_ROUNDS: u32 = 0;
    pub const ROUNDS: u32 = 10;
    pub const BUY_IN: u128 = 0;
}

/// Similarly to the first unit test, we can verify that the instantiation of the `MyPlayer`
/// contract succeeds. However, this requires much more code to be written.
///
/// Notice, that we are using new test marker: `ink_e2e::test`. It is responsible for building
/// contract, spinning up a chain and providing a client for the interaction.
///
/// The e2e testcases are implicitly `async` and thus we can (and must!) use `await` to wait for
/// the results of the calls.
#[ink_e2e::test]
fn instantiation_works(mut client: Client) -> E2EResult<()> {
    // We don't have access to the plain Rust struct anymore. Instead, we have to use the wrapper
    // types to prepare a constructor call.
    let constructor = MyPlayerRef::new((DIMENSION, DIMENSION), START);
    let _ = client
        .instantiate(
            // We point to the contract that we want to instantiate.
            "my-player",
            // We specify the caller.
            &ink_e2e::alice(),
            // We pass the instantiation intention.
            constructor,
            // We don't send any endowment to the contract.
            0,
            // We don't specify any storage deposit limit.
            None,
        )
        // In e2e testing, we have to asynchronously wait for the call result.
        .await
        .expect("Failed to instantiate contract");

    Ok(())
}

/// We can also check that our player indeed follows the assumed strategy. Analogously to the unit
/// test counterpart.
#[ink_e2e::test]
fn uses_dummy_strategy_correctly(mut client: Client) -> E2EResult<()> {
    // We move instantiation code to a helper function, so that we can briefly skip familiar parts.
    let player_address = instantiate_my_player(&mut client).await;

    // Similarly to the constructor, we build a call object using provided wrappers.
    let call = build_message::<MyPlayerRef>(player_address).call(|player| player.my_turn());

    for turn in START..(DIMENSION * DIMENSION) + START {
        let result = client
            .call(&ink_e2e::alice(), call.clone(), 0, None)
            .await
            .expect("Failed to get coordinates");

        // `result` object itself contains many information regarding the submitted extrinsic, like
        // gas consumption or emitted evets. However, we are only interested in the return value.
        if let Some((x, y)) = result.return_value() {
            assert_eq!(x, turn % DIMENSION);
            assert_eq!(y, turn / DIMENSION % DIMENSION);
        } else {
            panic!("Should have returned coordinates")
        }
    }

    Ok(())
}

/// E2E tests give us the power of testing multiple contracts together. In this test, we will
/// simulate the game with a single (our) player.
///
/// `ink_e2e::test` macro will take care of building and preparing the additional contracts.
#[ink_e2e::test(additional_contracts = "../../game/Cargo.toml")]
fn we_can_simulate_one_player_game(mut client: Client) -> E2EResult<()> {
    // Instantiate contracts.
    let player_address = instantiate_my_player(&mut client).await;
    let game_address = instantiate_game(&mut client).await;

    // Calling the game address is very similar to the calls that we did in the previous testcase,
    // so again, we move it to a helper function.

    // Register our player.
    game_action(&mut client, game_address, |c| {
        c.register_player(player_address, "Player 1".into())
    })
    .await;

    // Start the game.
    game_action(&mut client, game_address, |c| c.start_game()).await;

    // Submit turns until the game is finished.
    for _ in 0..ROUNDS {
        // We can check the state of the game at any time. But do we really have to...?
        if CHECK_STATE_BEFORE_EVERY_TURN {
            game_action(&mut client, game_address, |c| c.state()).await;
        }
        game_action(&mut client, game_address, |c| c.submit_turn()).await;
    }

    // End game.
    game_action(&mut client, game_address, |c| c.end_game()).await;

    Ok(())
}

/// We can also simulate the game with many players. This is where the power of E2E tests really
/// shines. We can test the interaction between contracts, which is not possible in unit tests.
#[ink_e2e::test(
    additional_contracts = "../../game/Cargo.toml ../rand-player/Cargo.toml ../corner-player/Cargo.toml"
)]
fn we_can_simulate_game_with_many_players(mut client: Client) -> E2EResult<()> {
    let my_player_address = instantiate_my_player(&mut client).await;
    let rand_player_address = instantiate_rand_player(&mut client).await;
    let corner_player_address = instantiate_corner_player(&mut client).await;
    let game_address = instantiate_game(&mut client).await;

    game_action(&mut client, game_address, |c| {
        c.register_player(my_player_address, "Player 1".into())
    })
    .await;
    game_action(&mut client, game_address, |c| {
        c.register_player(rand_player_address, "Player 2".into())
    })
    .await;
    game_action(&mut client, game_address, |c| {
        c.register_player(corner_player_address, "Player 3".into())
    })
    .await;

    game_action(&mut client, game_address, |c| c.start_game()).await;

    for _ in 0..ROUNDS {
        if CHECK_STATE_BEFORE_EVERY_TURN {
            game_action(&mut client, game_address, |c| c.state()).await;
        }
        game_action(&mut client, game_address, |c| c.submit_turn()).await;
    }

    game_action(&mut client, game_address, |c| c.end_game()).await;

    let state = game_action(&mut client, game_address, |c| c.state())
        .await
        .return_value();
    // Since one of our players makes random moves, we can't say deterministically who the winner
    // is. We are only interested in ensuring that the game is finished.
    assert!(matches!(state, State::Finished { .. }));

    Ok(())
}

/// Useful helper functions that we use in the testcases.
mod utils {
    use ink::{
        codegen::TraitCallBuilder,
        env::{
            call::{
                utils::{ReturnType, Set, Unset},
                Call, CallBuilder, CreateBuilder, ExecutionInput,
            },
            DefaultEnvironment,
        },
        primitives::{AccountId, Hash},
    };
    use ink_e2e::{build_message, CallResult, Client, PolkadotConfig};
    use scale::Encode;
    use rand_player::RandPlayerRef;
    use corner_player::CornerPlayerRef;

    use crate::{
        e2e_tests::{GameRef, BUY_IN, DIMENSION, FIELD, FORMING_ROUNDS, ROUNDS, START},
        my_player::MyPlayerRef,
    };

    /// Instantiate my player contract.
    pub async fn instantiate_my_player(
        client: &mut Client<PolkadotConfig, DefaultEnvironment>,
    ) -> AccountId {
        instantiate(
            client,
            "my-player",
            MyPlayerRef::new((DIMENSION, DIMENSION), START),
        )
        .await
    }

    /// Instantiate the random player contract.
    pub async fn instantiate_rand_player(
        client: &mut Client<PolkadotConfig, DefaultEnvironment>,
    ) -> AccountId {
        instantiate(
            client,
            "rand-player",
            RandPlayerRef::new((DIMENSION, DIMENSION)),
        )
            .await
    }

    /// Instantiate the random player contract.
    pub async fn instantiate_corner_player(
        client: &mut Client<PolkadotConfig, DefaultEnvironment>,
    ) -> AccountId {
        instantiate(
            client,
            "corner-player",
            CornerPlayerRef::new((DIMENSION, DIMENSION)),
        )
            .await
    }

    /// Instantiate the game contract.
    pub async fn instantiate_game(
        client: &mut Client<PolkadotConfig, DefaultEnvironment>,
    ) -> AccountId {
        instantiate(
            client,
            "squink_splash",
            GameRef::new(FIELD, BUY_IN, FORMING_ROUNDS, ROUNDS),
        )
        .await
    }


    /// General instantiation helper.
    ///
    /// Unfortunately, requires some generic hell.
    async fn instantiate<ContractRef, Args: Encode, R>(
        client: &mut Client<PolkadotConfig, DefaultEnvironment>,
        contract_name: &str,
        constructor: CreateBuilder<
            DefaultEnvironment,
            ContractRef,
            Unset<Hash>,
            Unset<u64>,
            Unset<u128>,
            Set<ExecutionInput<Args>>,
            Unset<ink::env::call::state::Salt>,
            Set<ReturnType<R>>,
        >,
    ) -> AccountId {
        client
            .instantiate(contract_name, &ink_e2e::alice(), constructor, 0, None)
            .await
            .expect("Failed to instantiate contract")
            .account_id
    }

    /// Perform arbitrary interaction with the game contract.
    pub async fn game_action<Action, Args, RetType>(
        client: &mut Client<PolkadotConfig, DefaultEnvironment>,
        game_address: AccountId,
        mut action: Action,
    ) -> CallResult<PolkadotConfig, DefaultEnvironment, RetType>
    where
        Action: FnMut(
            &mut <GameRef as TraitCallBuilder>::Builder,
        ) -> CallBuilder<
            DefaultEnvironment,
            Set<Call<DefaultEnvironment>>,
            Set<ExecutionInput<Args>>,
            Set<ReturnType<RetType>>,
        >,
        Args: scale::Encode,
        RetType: scale::Decode,
    {
        client
            .call(
                &ink_e2e::alice(),
                build_message::<GameRef>(game_address).call(|c| action(c)),
                0,
                None,
            )
            .await
            .unwrap()
    }
}
