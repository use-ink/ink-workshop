# 🦑 ink! Championship

This repository contains an interactive ink! workshop. 
We created it as a way of gamifying the experience of learning ink!.

The workshop is a game, in which students write a smart contract
that plays on their behalf – an agent.
The score function of the game was chosen in a way that it favors
contracts that are using as little as gas possible to play the game.
This can be done using smart contract best practices.

This repository contains:

* `game/`: A smart contract that runs the game. Workshop participants
  have to register their player with the game contract.
* `simple-player`: Example of a player contract, a skeleton for your strategy
* `frontend/`: The Game UI, which the workshop instructor can put
  on a big screen, so that participants can see live how their agents
  are doing.

## Setup
1. Make sure you have latest Rust installed
2. Install `cargo-contract` by running `cargo install cargo-contract --locked --force --version 4.0.0-alpha`
3. If you don't have a wallet, we recommend installing browser based on like [PolkadotJS][https://polkadot.js.org/extension/], 
or other Polkadot wallets (e.g. Talisman, SubWallet)
4. Get some faucet tokens from Rococo testnet: https://use.ink/faucet/
You can see the funds under
[the "Accounts" tab for the `Contracts` parachain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frococo-contracts-rpc.polkadot.io#/accounts).



There are two other relevant repositories:

* [paritytech/squink-splash-beginner](https://github.com/paritytech/squink-splash-beginner):
  Contains setup instructions for the workshop participants and a
  basic player to participate in the game.
* [paritytech/squink-splash-advanced](https://github.com/paritytech/squink-splash-advanced):
  Contains pointers to advanced ideas for playing the game.