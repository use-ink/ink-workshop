# Testing strategies for ink! smart contracts

In this directory you can find a collection of three main testing strategies for ink! smart contracts.
We present them in the context of the Squink-Splash game.

## Code organization

We will be testing a simple player strategy for the Squink-Splash game.
Our player's contract can be found in [my-player](./my-player) directory.
There, you will also find all the tests.

In order to test our strategy in a full game simulation against other players, we also include two other simple players:
 - [random-player](./random-player) - a player that makes random moves
 - [corner-player](./corner-player) - a player that starts painting in the right bottom corner of the board and then moves towards the left top corner

## Running tests

In order to run the tests, you need to have `cargo-contract` installed.
You can do that by running:
```bash
cargo install cargo-contract
```

Then, you can run the tests by executing:
```bash
# run unit tests (optionally with `--release` flag)
cargo test --features unit-tests

# run e2e tests (optionally with `--release` flag)
cargo test --features e2e-tests

# run quasi-e2e tests (optionally with `--release` flag)
./build_contracts.sh && cargo test --features drink-tests
```

_Note: We for the quasi-e2e tests, we need to build the contracts manually.
For other tests, `cargo test` will do that for us, but will also remove `json` metadata files, which are needed for the drink! framework._

---

## Testing strategies

There are three primary paradigms for testing ink! smart contracts:
 - [Unit testing](./my-player/src/unit_tests.rs)
 - [End-to-End testing](./my-player/src/e2e_tests.rs)
 - ['quasi-End-to-End' testing](./my-player/src/drink_tests.rs)

The best way to understand the differences between them is to look at the technology stack, that they are touching.

**TODO: describe in brief the stack and how it relates to these paradigms**
