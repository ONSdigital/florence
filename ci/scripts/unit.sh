#!/bin/bash -eux

export GOPATH=$(pwd)/go

pushd $GOPATH/src/github.com/ONSdigital/florence
make test
  if  prettier --check "src/app/**/*.js" | tee /dev/stderr | grep -q "Code style issues found"; then
    #exit 123
  fi
popd
