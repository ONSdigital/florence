#!/bin/bash -eux

cwd=$(pwd)

pushd $cwd/florence
  make node-modules

  # Sleeping for a bit if necessary as a workaround to allow time for main.min.css to finish writing
  for i in {1..10}
    do if [ -e ../dist/legacy-assets/css/main.min.css ]
      then break
    fi
    echo "Waiting for main.min.css $i/10"
    sleep 2
  done

  make build && cp Dockerfile.concourse build/florence $cwd/build
popd
