# Setup

## Installation
We are going to be using ink! version 4. We will do this by installing `cargo-contract` a CLI to compile contracts written in ink!

Install the `cargo-contract` package by following [these](https://docs.substrate.io/tutorials/smart-contracts/prepare-your-first-contract/#install-additional-packages) instructions.

**NOTE:** For ink! 4 you must use Rust stable.

$ `rustup default stable`

## Fund your Wallet
To participate in this workshop you will need a browser wallet such as Talisman ([Firefox](https://addons.mozilla.org/en-US/firefox/addon/talisman-wallet-extension/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search) / [Chrome](https://chrome.google.com/webstore/detail/talisman-polkadot-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld?hl=en)) or PolkadotJS.

Visit the rococo faucet [matrix channel](https://matrix.to/#/#rococo-faucet:matrix.org).

Use the command `!drip YOUR_WALLET_ADDRESS:1002` (Note the `:1002` on the end. We need this so it points to *Contracts on Rococo*, not Rococo)

## Need help?
Message the ink! team in [Parity Smart Contracts [internal]](https://matrix.to/#/!nqwrcufvSwqTNsLMkj:matrix.parity.io?via=matrix.parity.io&via=web3.foundation).