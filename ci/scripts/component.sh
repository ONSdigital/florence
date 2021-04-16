#!/bin/bash -eux

cwd=$(pwd)

pushd $cwd/florence
#    apt-get install -y --no-install-recommends apt-utils
    apt -y update
    apt -y install gdebi-core
#    wget https://dl-ssl.google.com/linux/direct/google-chrome-stable_current_i386.deb
    wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
    gdebi google-chrome-stable_current_amd64.deb
#    apt -f -y  install
#    apt -y install google-chrome-stable
    make test-component
popd