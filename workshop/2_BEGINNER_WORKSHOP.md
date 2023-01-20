# Beginner Workshop - ink! Splash

<img src="../.images/finished-game.png" width="100%" />

## Workshop Goals
After this workshop you will know how to:
* Use `#[ink::contract]` and `#[ink(message)]` macros
* Compile an ink! smart contract 
* Deploy your contract using the `*.contract` files

## Prerequisites
* Complete the [Setup Guide](https://github.com/paritytech/ink-workshop/blob/main/workshop/1_SETUP.md).
* Clone the repo:
```sh
git clone --depth 1 git@github.com:paritytech/ink-workshop.git
```

## The Game
Squink Splash is a game where participants paint as many squares on a game board as possible within a fixed amount of blocks on the blockchain. Those who paint the most squares and use the least amount of gas will earn the most points. Squares are painted by submitting a transaction to a master Game instance, which will then call your code inside the Player contract that you will compile and deploy in the following steps. 

<img src="../.images/coordinates.png" width="100%" />

## Updating the Player Contract

You are going to use a pre-existing smart contract called "Player" located here:
```sh
./beginners-workshop/basic-player/lib.rs
```

1. Update the function `your_turn` so that it returns your two favorite numbers between 0-9 for both the x and the y dimensions. e.g. `Field { x: 3, y: 7 }`
2. Compile the contract:
```sh
# Inside of ./beginners-workshop/basic-player/
cargo contract build --release
```
This will generate the file `./target/ink/player.contract`, which contains a WASM blob (deployed to the blockchain) and Metadata (used for client applications) that you will use to deploy next.

## Deploying the Player contract

NOTE: The person leading the workshop will first deploy a master Game contract and will give you the contract instance's address. You will need to pass this value to the constructor of your Player.

1. Visit [contracts-ui.substrate.io](https://contracts-ui.substrate.io/add-contract):
2. Choose `Upload New Contract Code`, then `Upload Contract Bundle`.
3. Navigate to your newly compiled `player.contract` file and then click `Next`.

<img src="../.images/add-contract.png" width="100%" />

Voilà. You should see a contructor function with a `game` parameter. 

4. Click on the dropdown, paste in the address of the deployed Game contract that the moderator shared with you, and hit `<ENTER>`.
5. Click `Next`, then `Upload and Instantiate`.
6. Your browser extension should pop up requesting your signature. Sign it!

<img src="../.images/constructor.png" width="100%" />

If your contract was successfully deployer you should see the address on the top of the page. You will need this in a second.

<img src="../.images/player-address.png" width="100%" />

## Joining the Game

1. Visit [splash.use.ink](https://splash.use.ink) and paste in the Game address that your moderator shared with you.
2. Click on `JOIN GAME` in the bottom right
3. Add your player's name ([emojis are allowed 🦑](https://getemoji.com/)), and add the address of your deployed Player contract.
4. Click `REGISTER` and sign the transaction

<img src="../.images/register.png" width="100%" />

## Game Start and Player Turns!

After all players have registered your moderator will start the game via a blockchain transaction. Once the game has started you will be able to submit your turn. 

1. Click `Submit Turn` on the bottom right 
2. Sign the transaction.

<img src="../.images/play.png" width="100%" />

## 🍀 Good luck!