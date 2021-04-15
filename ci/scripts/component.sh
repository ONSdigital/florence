#!/bin/bash -eux

cwd=$(pwd)

pushd $cwd/florence
    apt-get -y update
    apt-get -y install google-chrome-stable
    make test-component
popd
