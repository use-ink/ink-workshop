# Setup

## Installation
We are going to be using ink! version 4, which comes bundled in `cargo-contract` - a CLI to work with contracts written in ink!

**NOTE:** For ink! 4 you must use Rust stable.

1. `rustup default stable`

2. Install `cargo-contract`
    - Install cargo-contract by running the following command:

        ```cargo install cargo-contract --version 2.0.0-alpha.5```

    - Verify the version is `2^`

        ```cargo-contract --version```

## Fund your Wallet
To participate in this workshop you will need a browser wallet such as Talisman ([Firefox](https://addons.mozilla.org/en-US/firefox/addon/talisman-wallet-extension/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search) / [Chrome](https://chrome.google.com/webstore/detail/talisman-polkadot-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld?hl=en)) or PolkadotJS.

1. Visit the rococo faucet [matrix channel](https://matrix.to/#/#rococo-faucet:matrix.org).

2. Use the command `!drip YOUR_WALLET_ADDRESS:1002` (Note the `:1002` on the end. We need this so it points to *Contracts on Rococo*, not Rococo)

## Need help?
Message the ink! team in [Parity Smart Contracts [internal]](https://matrix.to/#/!nqwrcufvSwqTNsLMkj:matrix.parity.io?via=matrix.parity.io&via=web3.foundation).