#!/bin/bash -eux

cwd=$(pwd)

pushd $cwd/florence
  go install github.com/jteeuwen/go-bindata/go-bindata
  make test-component
popd
