use drink::{
    chain_api::ChainApi,
    runtime::MinimalRuntime,
    session::{MessageResult, Session},
};
use scale::Decode;

use crate::drink_tests::{
    game_parameters::{BUY_IN, DIMENSION, FORMING_ROUNDS, ROUNDS, START},
    utils::{bytes, instantiate_my_player, transcoder},
    Contract::{CornerPlayer, Game, MyPlayer, RandPlayer},
};

type TestResult<T> = Result<T, Box<dyn std::error::Error>>;

#[derive(Copy, Clone)]
pub enum Contract {
    MyPlayer,
    RandPlayer,
    CornerPlayer,
    Game,
}

mod game_parameters {
    pub const DIMENSION: u32 = 4;
    pub const START: u32 = 1;
    pub const FORMING_ROUNDS: u32 = 0;
    pub const ROUNDS: u32 = 10;
    pub const BUY_IN: u128 = 0;
}

#[test]
fn instantiation_works() -> TestResult<()> {
    let mut session = Session::<MinimalRuntime>::new(Some(transcoder(MyPlayer)))?;
    session.deploy(
        bytes(MyPlayer),
        "new",
        &[format!("({DIMENSION},{DIMENSION})"), START.to_string()],
        vec![],
    )?;
    Ok(())
}

#[test]
fn uses_dummy_strategy_correctly() -> TestResult<()> {
    let session = Session::<MinimalRuntime>::new(Some(transcoder(MyPlayer)))?;
    let raw_coordinates = instantiate_my_player(session).call("my_turn", &[])?;
    let coordinates: MessageResult<Option<(u32, u32)>> =
        MessageResult::decode(&mut raw_coordinates.as_slice()).expect("Failed to decode result");
    assert_eq!(coordinates, Ok(Some((1, 0))));
    Ok(())
}

#[test]
fn we_can_simulate_game_with_many_players() -> TestResult<()> {
    let dim_arg = format!("({DIMENSION},{DIMENSION})");
    let my_player_args = [dim_arg.clone(), START.to_string()];
    let game_args = [
        format!("{{x:{DIMENSION},y:{DIMENSION}}}"),
        BUY_IN.to_string(),
        FORMING_ROUNDS.to_string(),
        ROUNDS.to_string(),
    ];

    let session = Session::<MinimalRuntime>::new(Some(transcoder(MyPlayer)))?
        .deploy_and(bytes(MyPlayer), "new", &my_player_args, vec![])?
        .with_transcoder(Some(transcoder(RandPlayer)))
        .deploy_and(bytes(RandPlayer), "new", &[dim_arg.clone()], vec![])?
        .with_transcoder(Some(transcoder(CornerPlayer)))
        .deploy_and(bytes(CornerPlayer), "new", &[dim_arg.clone()], vec![])?
        .with_transcoder(Some(transcoder(Game)))
        .deploy_and(bytes(Game), "new", &game_args, vec![])?;

    let addresses: [String; 4] = session
        .deployed_contracts()
        .into_iter()
        .map(|c| c.to_string())
        .collect::<Vec<_>>()
        .try_into()
        .unwrap();
    let [my_player, rand_player, corner_player, _game] = addresses;

    let mut session = session
        .call_and("register_player", &[my_player, format!("\"Player 0\"")])?
        .call_and("register_player", &[rand_player, format!("\"Player 1\"")])?
        .call_and("register_player", &[corner_player, format!("\"Player 2\"")])?
        .call_and("start_game", &[])?;

    for _ in 0..ROUNDS {
        session
            .chain_api()
            .build_block()
            .expect("Failed to build block");
        session.call("submit_turn", &[])?;
    }

    session.call("end_game", &[])?;

    Ok(())
}

mod utils {
    use std::{fs, path::PathBuf, rc::Rc};

    use drink::{
        runtime::MinimalRuntime,
        session::{contract_transcode::ContractMessageTranscoder, Session},
    };

    use crate::drink_tests::{game_parameters::START, Contract, Contract::*, DIMENSION};

    impl Contract {
        fn name(self) -> &'static str {
            match self {
                MyPlayer => "my_player",
                RandPlayer => "rand_player",
                CornerPlayer => "corner_player",
                Game => "squink_splash",
            }
        }

        fn base_path(self) -> &'static str {
            match self {
                MyPlayer => "./target/ink",
                RandPlayer => "../rand-player/target/ink",
                CornerPlayer => "../corner-player/target/ink",
                Game => "../../game/target/ink",
            }
        }
    }

    pub fn transcoder(contract: Contract) -> Rc<ContractMessageTranscoder> {
        Rc::new(
            ContractMessageTranscoder::load(PathBuf::from(format!(
                "{}/{}.json",
                contract.base_path(),
                contract.name()
            )))
            .expect("Failed to create transcoder"),
        )
    }

    pub fn bytes(contract: Contract) -> Vec<u8> {
        fs::read(format!("{}/{}.wasm", contract.base_path(), contract.name()))
            .expect("Failed to find or read contract file")
    }

    pub fn instantiate_my_player(session: Session<MinimalRuntime>) -> Session<MinimalRuntime> {
        session
            .deploy_and(
                bytes(MyPlayer),
                "new",
                &[format!("({DIMENSION},{DIMENSION})"), START.to_string()],
                vec![],
            )
            .expect("Failed to instantiate contract")
    }
}
