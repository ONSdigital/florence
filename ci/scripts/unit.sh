#!/bin/bash -eux

pushd florence
  mvn clean surefire:test
popd
