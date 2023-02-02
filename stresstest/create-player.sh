#!/bin/bash
set -exo pipefail

# The script instantiates a player on-chain and registers it
# with the game.
#
# Usage:
#
# /bin/bash stresstest.sh <SALT> <GAME_CONTRACT>

if [[ -z "${SURI}" ]]; then
  echo "Please set the SURI env variable!"
  exit 1
fi
if [[ -z "$1" ]]; then
  echo "Please supply an odd random number as the first argument!"
  exit 1
fi
if [[ -z "$2" ]]; then
  echo "Please supply the game contract address as the second argument!"
  exit 1
fi

SALT=$1
GAME=$2

CONTRACT=$(cargo contract instantiate\
		--url wss://rococo-contracts-rpc.polkadot.io\
		--suri "$SURI"\
		--skip-confirm\
		--salt $SALT\
		--skip-dry-run\
		--gas 300000000000\
		--proof-size 512000\
		--args "(15,15)" $SALT | grep "Contract" | tail -n1 | cut -d ' ' -f6)
echo "Instantiated player contract at $CONTRACT"

echo "Registering player $CONTRACT with game at $GAME"
cargo contract call\
		--url wss://rococo-contracts-rpc.polkadot.io\
		--suri "melt just mouse also lizard tail afford trophy visit sport wrap neck"\
		--skip-dry-run\
		--gas 300000000000\
		--proof-size 512000\
		--contract "$GAME"\
		--manifest-path=../game/Cargo.toml\
		--message register_player\
		--args "$CONTRACT" \"player$SALT\"\
		--skip-confirm