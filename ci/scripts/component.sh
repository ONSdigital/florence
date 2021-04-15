#!/bin/bash -eux

cwd=$(pwd)

pushd $cwd/florence
    apt-get update
    apt-get install chromium-browser
    make component-test
popd
