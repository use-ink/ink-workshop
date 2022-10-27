# Squink Splash!

Compete to win your place on the board.

[Installation instructions](https://github.com/paritytech/ink-workshop/blob/main/workshop/1_SETUP.md)

By default the page will connect to the Contracts Rococo network. 

### Running the Dapp locally

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

An example game can be found using this address. Enter it into the input on the home page.

### Completed Game

```5CWnF6YqFXLaMQ1MddNQ76MfLyEK9mvL2nEECvpd3bRTGbWM```

If you would like to deploy your own game here are the steps:

1. deploy your game contract here https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frococo-contracts-rpc.polkadot.io#/contracts
2. deploy one or more player contracts and register them in the game contract
3. copy the game contract address and enter it in to the input on the home page of the frontend app. Submit!
4. In polkadot.js you can now submit your turns.

Note: The frontend currently does not update in real time. We need to tweak the subscriptions. Just refresh the page for now!
