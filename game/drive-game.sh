#!/bin/sh
set -euxo pipefail
for (( ; ; ))
do
	cargo contract call\
		--url wss://rococo-contracts-rpc.polkadot.io\
		--contract "$1"\
		--suri "${SURI}"\
		--message submit_turn\
		--skip-dry-run\
		--gas 300000000000\
		--proof-size 512000\
		--skip-confirm
done
