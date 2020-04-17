#!/bin/bash -eux

export cwd=$(pwd)

pushd $cwd/florence
  make audit
popd