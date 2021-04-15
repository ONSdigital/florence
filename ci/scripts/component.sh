#!/bin/bash -eux

cwd=$(pwd)

pushd $cwd/florence
    apt-get -y update
    apt-get -y install software-properties-common
    add-apt-repository ppa:canonical-chromium-builds/stage
    apt-get -y update
    apt-get -y install chromium-browser
    make test-component
popd