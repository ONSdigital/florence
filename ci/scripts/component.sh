#!/bin/bash -eux

cwd=$(pwd)

pushd $cwd/florence
    apt-get -y update
    apt-get install -y libappindicator1 fonts-liberation
#    apt-get install -y --no-install-recommends apt-utils
    wget https://dl-ssl.google.com/linux/direct/google-chrome-stable_current_i386.deb
    dpkg -i --force-depends google-chrome-stable_current_i386.deb
#    apt -f -y  install
    make test-component
popd