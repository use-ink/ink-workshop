//! The last paradigm can be called: 'quasi-E2E` testing. It is based on the drink! library
//! (https://github.com/Cardinal-Cryptography/drink/). It is a peculiar trade-off between unit
//! and E2E testing.
//!
//! The idea is that we do not have a running node at all. We keep a wrapped runtime in the memory
//! and interact with it directly. While it is not the perfectly realistic environment, it is still
//! a very good approximation of the real world. Thanks to the architecture, everything is kept
//! synchronous and instant. Also, we have more power over the chain itself, and thus we can easily
//! manipulate the whole state, for example block building.
//!
//! Since the library is pretty fresh, sometimes it comes with onerous API or some not obvious
//! behavior. Please be patient and do not hesitate to raise an issue or ask for help :)

use drink::{
    chain_api::ChainApi,
    runtime::MinimalRuntime,
    session::{MessageResult, Session},
};
use ink::scale::Decode;
use squink_splash::State;

use crate::drink_tests::{
    game_parameters::{BUY_IN, DIMENSION, FORMING_ROUNDS, ROUNDS, START},
    utils::{bytes, instantiate_my_player, transcoder},
    Contract::{CornerPlayer, Game, MyPlayer, RandPlayer},
};

/// Just a type alias for the result type of quasi-E2E testcases.
type TestResult<T> = Result<T, Box<dyn std::error::Error>>;

/// The contracts we want to test.
#[derive(Copy, Clone)]
pub enum Contract {
    MyPlayer,
    RandPlayer,
    CornerPlayer,
    Game,
}

/// We gather all game parameters in this module, so that we can easily change and access them.
mod game_parameters {
    pub const DIMENSION: u32 = 4;
    pub const START: u32 = 1;
    pub const FORMING_ROUNDS: u32 = 0;
    pub const ROUNDS: u32 = 10;
    pub const BUY_IN: u128 = 0;
}

/// As in the unit tests and e2e tests, we can verify, that the contract instantiation works well.
#[test]
fn instantiation_works() -> TestResult<()> {
    // We create a transcoding object for interacting with our contract. It is a wrapper around the
    // contract ABI, which allows us to translate string argument values into properly encoded
    // bytes.
    let contract_transcoder = transcoder(MyPlayer);

    // We create a new session object. While `drink!` exposes also a low-level API (`Sandbox`), it
    // is way more convenient to use the `Session` API. It keeps the context, caller, and other
    // information for us. Also, it allows to work with weak types instead of raw bytes.
    //
    // `drink!` allows to work with an arbitrary runtime. In this case, we use the minimal one,
    // which provides only these pallets that enable working with the ink! contracts.
    let mut session = Session::<MinimalRuntime>::new(Some(contract_transcoder))?;
    session.deploy(
        // We pass raw contract bytes.
        bytes(MyPlayer),
        // We pass the constructor name.
        "new",
        // We pass argument values. The transcoding object will take care of encoding them.
        &[format!("({DIMENSION},{DIMENSION})"), START.to_string()],
        // We don't need any salt for account generation.
        vec![],
    )?;
    Ok(())
}

/// As always, we can write a test verifying the contract behavior. In this case, we want to verify
/// that the contract returns the correct coordinates.
#[test]
fn uses_dummy_strategy_correctly() -> TestResult<()> {
    let session = Session::<MinimalRuntime>::new(Some(transcoder(MyPlayer)))?;
    // Similarly to the e2e tests, we move the familiar boilerplate logic to a helper function.
    let raw_coordinates = instantiate_my_player(session).call("my_turn", &[])?;
    // `call` returned raw bytes, so we need to decode them. We use the `MessageResult` type, which
    // is the exact return value from any ink! contract message.
    let coordinates: MessageResult<Option<(u32, u32)>> =
        MessageResult::decode(&mut raw_coordinates.as_slice())?;
    assert_eq!(coordinates?, Some((1, 0)));
    Ok(())
}

/// We can easily test multiple contracts. In this case, we want to verify that the game contract
/// works well with many players.
#[test]
fn we_can_simulate_game_with_many_players() -> TestResult<()> {
    // Prepare contract constructor arguments.
    let dim_arg = format!("({DIMENSION},{DIMENSION})");
    let my_player_args = [dim_arg.clone(), START.to_string()];
    let game_args = [
        format!("{{x:{DIMENSION},y:{DIMENSION}}}"),
        BUY_IN.to_string(),
        FORMING_ROUNDS.to_string(),
        ROUNDS.to_string(),
    ];

    // Deploy all contracts. Remember to use appropriate transcoder for every contract.
    let session = Session::<MinimalRuntime>::new(Some(transcoder(MyPlayer)))?
        .deploy_and(bytes(MyPlayer), "new", &my_player_args, vec![])?
        .with_transcoder(Some(transcoder(RandPlayer)))
        .deploy_and(bytes(RandPlayer), "new", &[dim_arg.clone()], vec![])?
        .with_transcoder(Some(transcoder(CornerPlayer)))
        .deploy_and(bytes(CornerPlayer), "new", &[dim_arg.clone()], vec![])?
        .with_transcoder(Some(transcoder(Game)))
        .deploy_and(bytes(Game), "new", &game_args, vec![])?;

    // Get the addresses of the deployed contracts.
    let addresses: [String; 4] = session
        .deployed_contracts()
        .into_iter()
        .map(|c| c.to_string())
        .collect::<Vec<_>>()
        .try_into()
        .unwrap();
    let [my_player, rand_player, corner_player, _game] = addresses;

    // Register players.
    let mut session = session
        .call_and("register_player", &[my_player, format!("\"Player 0\"")])?
        .call_and("register_player", &[rand_player, format!("\"Player 1\"")])?
        .call_and("register_player", &[corner_player, format!("\"Player 2\"")])?
        .call_and("start_game", &[])?;

    // Play the game.
    for _ in 0..ROUNDS {
        session.chain_api().build_block()?;
        session.call("submit_turn", &[])?;
    }

    // End the game.
    session.call("end_game", &[])?;

    // Check the game state.
    let raw_state = session.call("state", &[])?;
    let state: MessageResult<State> = MessageResult::decode(&mut raw_state.as_slice())?;
    assert!(matches!(state?, State::Finished { .. }));

    Ok(())
}

/// Useful helper functions that we use in the testcases.
mod utils {
    use std::{fs, path::PathBuf, rc::Rc};

    use drink::{
        runtime::MinimalRuntime,
        session::{contract_transcode::ContractMessageTranscoder, Session},
    };

    use crate::drink_tests::{game_parameters::START, Contract, Contract::*, DIMENSION};

    // Some convenient functions for lookup of the contract files.
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

    /// Build a transcoding object for a given contract.
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

    /// Load the contract bytes from the file.
    pub fn bytes(contract: Contract) -> Vec<u8> {
        fs::read(format!("{}/{}.wasm", contract.base_path(), contract.name()))
            .expect("Failed to find or read contract file")
    }

    /// Instantiate the `MyPlayer` contract.
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
