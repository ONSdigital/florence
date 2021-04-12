#!/bin/bash -eux

cwd=$(pwd)

pushd $cwd/florence
  make test-component
popd