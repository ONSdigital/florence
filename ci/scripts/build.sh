#!/bin/bash -eux

cwd=$(pwd)

pushd $cwd/florence
  make build && cp Dockerfile.concourse build/florence $cwd/build
popd
