#!/bin/bash -ux

pushd sixteens
  TAG=$(git describe --exact-match HEAD 2>/dev/null)
  REV=$(git rev-parse --short HEAD)
popd

if [[ $TAG =~ ^release/([0-9]+\.[0-9]+\.[0-9]+(\-rc[0-9]+)?$) ]]; then
  DIRECTORY=${BASH_REMATCH[1]}
else
  DIRECTORY=$REV
fi

cp -r dist artifacts/$DIRECTORY
