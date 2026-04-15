#!/bin/bash -eux

cwd=$(pwd)

pushd $cwd/florence
  make lint
popd
