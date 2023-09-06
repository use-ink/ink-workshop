use game_parameters::*;
use ink_e2e::build_message;
use squink_splash::{Game as GameRef, State};
use utils::*;

use crate::my_player::MyPlayerRef;

type E2EResult<T> = Result<T, Box<dyn std::error::Error>>;

const CHECK_STATE_BEFORE_EVERY_TURN: bool = true;

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

#[ink_e2e::test]
fn instantiation_works(mut client: Client) -> E2EResult<()> {
    let _ = client
        .instantiate(
            "my-player",
            &ink_e2e::alice(),
            MyPlayerRef::new((DIMENSION, DIMENSION), START),
            0,
            None,
        )
        .await
        .expect("Failed to instantiate contract");

    Ok(())
}

#[ink_e2e::test]
fn uses_dummy_strategy_correctly(mut client: Client) -> E2EResult<()> {
    let player_address = instantiate_my_player(&mut client).await;

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
    let player_address = instantiate_my_player(&mut client).await;
    let game_address = instantiate_game(&mut client).await;

    game_action(&mut client, game_address, |c| {
        c.register_player(player_address, "Player 1".into())
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

    Ok(())
}

#[ink_e2e::test(
    additional_contracts = "../../game/Cargo.toml ../rand-player/Cargo.toml ../corner-player/Cargo.toml"
)]
fn we_can_simulate_game_with_many_players(mut client: Client) -> E2EResult<()> {
    let my_player_address = instantiate_my_player(&mut client).await;
    let rand_player_address = instantiate_my_player(&mut client).await;
    let corner_player_address = instantiate_my_player(&mut client).await;
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
    assert!(matches!(state, State::Finished { .. }));

    Ok(())
}

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

    use crate::{
        e2e_tests::{GameRef, BUY_IN, DIMENSION, FIELD, FORMING_ROUNDS, ROUNDS, START},
        my_player::MyPlayerRef,
    };

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
