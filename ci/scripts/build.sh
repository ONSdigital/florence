#!/bin/bash -eux

cwd=$(pwd)

export GOPATH=$cwd/go

pushd $GOPATH/src/github.com/ONSdigital/florence
  make node-modules build && cp Dockerfile.concourse build/florence $cwd/build
popd
