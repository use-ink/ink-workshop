#!/usr/bin/env bash

cargo contract build --release

pushd ../corner-player/
cargo contract build --release
popd

pushd ../rand-player/
cargo contract build --release
popd

pushd ../../game/
cargo contract build --release
popd
