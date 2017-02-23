#!/bin/bash -eux

cp -r assets/ florence/src/main/web/

pushd florence
  mvn clean package dependency:copy-dependencies -Dmaven.test.skip
popd

cp -r florence/target/* target/
