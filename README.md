# ink! 3.0 workshop setup

How to setup ink! 3.0 and Canvas Node for the ink! 3.0 workshop at Sub0 2020.

1. Get the `rustup` Rust installer: https://rustup.rs/
1. Install the Substrate prerequisites:
    - `rustup install nightly-2020-10-06`
    - `rustup target add wasm32-unknown-unknown --toolchain nightly-2020-10-06`
1. Install Binaryen's WebAssembly optimizer:
    - Download at: https://github.com/WebAssembly/binaryen#tools
1. Default to the nightly compiler from 2020-10-14:
    - `rustup default nightly-2020-10-14`
1. Install `rust-src` component from `rustup`:
    - `rustup component add rust-src`
1. Install latest `cargo-contract` version from crates.io:
    - `cargo install cargo-contract --vers 0.7.0 --force`
    - See if it works: `cargo contract help`
    - Check if the version is at least 0.7: `cargo contract --version`
    - Create a new contract with `<name>` name with. `cargo contract new <name>`
        - Example for `flipper`: `cargo contract new flipper`
1. Install the Canvas node: https://github.com/paritytech/canvas-node
    - Install with:
      ```
      cargo +nightly-2020-10-06 install canvas-node --git https://github.com/paritytech/canvas-node.git --tag v0.1.0 --force
      ```
    - Run local development chain with: `canvas --dev`
    - Reset local development chain with: `canvas purge-chain --dev`
