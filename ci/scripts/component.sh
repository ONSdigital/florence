#!/bin/bash -eux

cwd=$(pwd)

pushd $cwd/florence
    apt-get -y update
    apt-get install -y libappindicator1 fonts-liberation libnss3 libxkbcommon0 libxshmfence1 xdg-utils libasound2 libgbm1
#    apt-get install -y --no-install-recommends apt-utils
    wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
    dpkg -i --force-depends google-chrome-stable_current_amd64.deb
#    apt -f -y  install
    make test-component
popd