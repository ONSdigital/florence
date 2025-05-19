#!/bin/bash -eux

cwd=$(pwd)

go install github.com/golangci/golangci-lint/cmd/golangci-lint@v1.64.6

pushd $cwd/florence
  make lint
popd
