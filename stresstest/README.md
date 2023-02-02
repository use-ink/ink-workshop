# Readme 

### Creating a game with many players

```bash
cd ink-workshop/
cd game/
cargo contract build --release
cd ../stresstest/
cargo contract build --release

export SURI="your twelve words"
/bin/bash stresstest.sh 3344
```
The parameter `3344` is a salt, it has to be a number with odd digits.

### Starting the game

```bash
cargo contract call\
    --url wss://rococo-contracts-rpc.polkadot.io\
    --suri "$SURI"\
    --contract $GAME\
    --manifest-path=../game/Cargo.toml\
    --message "start_game"\
    --skip-confirm
```

### Submitting a turn

```bash
cargo contract call\
    --url wss://rococo-contracts-rpc.polkadot.io\
    --suri "$SURI"\
    --contract $GAME\
    --manifest-path=../game/Cargo.toml\
    --message "submit_turn"\
    --skip-dry-run\
    --gas 300000000000\
    --proof-size 912000\
    --skip-confirm
```