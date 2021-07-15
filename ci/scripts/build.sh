#!/bin/bash -eux

cwd=$(pwd)

pushd $cwd/florence
  make node-modules wait-for-css build
  cp Dockerfile.concourse build/florence $cwd/build
popd
