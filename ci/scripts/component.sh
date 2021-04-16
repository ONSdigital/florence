#!/bin/bash -eux

cwd=$(pwd)

pushd $cwd/florence
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
#    apt-get install -y --no-install-recommends apt-utils
#    wget https://dl-ssl.google.com/linux/direct/google-chrome-stable_current_i386.deb
#    dpkg -i --force-depends google-chrome-stable_current_i386.deb
#    apt -f -y  install
    wget https://dl.google.com/linux/linux_signing_key.pub
    apt-key add linux_signing_key.pub
    apt -y update
    apt -u install apt-utils
    apt -y install google-chrome-stable
    make test-component
popd