# ink-3.0-workshop-setup
Hot to setup ink! 3.0 and Canvas Node for the ink! 3.0 workshop at Sub0 2020.

1. Get the `rustup` Rust installer: https://rustup.rs/
1. Default to the nightly compiler from 2020-10-14: `rustup default nightly-2020-10-14`
1. Install Binaryen's WebAssembly optimizer at: https://github.com/WebAssembly/binaryen#tools
1. Install `rust-src` component from `rustup`: `rustup component add rust-src`
1. Install latest `cargo-contract` version from crates.io: `cargo install cargo-contract`
1. View some `help` for `cargo-contract` and see if it works: `cargo contract help`
1. Git clone and install the Canvas node: https://github.com/paritytech/canvas-node
  - Install with: `cargo build --release`
  - Run with: `cargo run --release -- --dev`
