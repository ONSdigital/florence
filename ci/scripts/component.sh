#!/bin/bash -eux

cwd=$(pwd)

pushd $cwd/florence
  sudo apt update
  sudo apt install --assume-yes chromium-browser
  make test-component
popd