#!/bin/bash
set -exo pipefail

# The script instantiates the game and registers a larger amount of
# players with it. Players are instantiated by the script as well.
#
# Usage:
#
#   export SURI="your twelve words"
#   /bin/bash stresstest.sh <TWO_DIGIT_SALT> <GAME_CONTRACT_IF_EXISTENT>
#
# The second argument is optional. If omitted, the game contract will
# be instantiated.

if [[ -z "${SURI}" ]]; then
  echo "Please set the SURI env variable!"
  exit 1
fi

if [[ -z "$1" ]]; then
  echo "Please supply an odd random number as the first argument!"
  echo "This is the salt. E.g. `/bin/bash stresstest.sh 100`"
  exit 1
fi
SALT=$1

if [[ -z "${2}" ]]; then
  GAME=$(cargo contract instantiate\
		--url wss://rococo-contracts-rpc.polkadot.io\
		--suri "$SURI"\
		--skip-confirm\
		--salt $SALT\
		--manifest-path=../game/Cargo.toml\
		--constructor new\
		--args "{x: 15, y: 15}" 0 0 10 | grep "Contract" | tail -n1 | cut -d ' ' -f6)
  echo "Instantiated game contract at $GAME"
else
  GAME=$2
  echo "Using existing game contract $GAME"
fi

for i in {1..25}
do
  SALT=$((SALT + 1))
  /bin/bash create-player.sh $SALT $GAME
done