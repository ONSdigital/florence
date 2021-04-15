#!/bin/bash -eux

cwd=$(pwd)

pushd $cwd/florence
    wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
    dpkg -i google-chrome-stable_current_amd64.deb
    apt -f install
    make test-component
popd