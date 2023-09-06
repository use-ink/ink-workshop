use drink::{runtime::MinimalRuntime, session::Session};

use crate::drink_tests::{
    game_parameters::{DIMENSION, START},
    utils::{bytes, transcoder},
    Contract::MyPlayer,
};

#[derive(Copy, Clone)]
pub enum Contract {
    MyPlayer,
    RandPlayer,
    CornerPlayer,
    Game,
}

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

#[test]
fn instantiation_works() {
    let mut session = Session::<MinimalRuntime>::new(Some(transcoder(MyPlayer))).unwrap();
    session
        .deploy(
            bytes(MyPlayer),
            "new",
            &[format!("({DIMENSION},{DIMENSION})"), START.to_string()],
            vec![],
        )
        .expect("Failed to instantiate contract");
}

mod utils {
    use std::{fs, path::PathBuf, rc::Rc};

    use drink::session::contract_transcode::ContractMessageTranscoder;

    use crate::drink_tests::Contract;

    impl Contract {
        fn name(self) -> &'static str {
            match self {
                Contract::MyPlayer => "my_player",
                Contract::RandPlayer => "rand_player",
                Contract::CornerPlayer => "corner_player",
                Contract::Game => "squink_splash",
            }
        }

        fn base_path(self) -> &'static str {
            match self {
                Contract::MyPlayer => "./target/ink",
                Contract::RandPlayer => "../rand-player/target/ink",
                Contract::CornerPlayer => "../corner-player/target/ink",
                Contract::Game => "../../game/target/ink",
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
}
