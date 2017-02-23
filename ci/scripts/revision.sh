#!/bin/bash -ux

pushd florence
  TAG=$(git describe --exact-match HEAD 2>/dev/null)
  REV=$(git rev-parse --short HEAD)
popd

if [[ $TAG =~ ^release/(([0-9]+)\.([0-9]+)\.([0-9]+)(\-rc[0-9]+)?$) ]]; then
  echo ${BASH_REMATCH[1]} > artifacts/revision

  MAJOR=${BASH_REMATCH[2]}
  MINOR=${BASH_REMATCH[3]}
  BUILD=${BASH_REMATCH[4]}

  printf '{"major": %d, "minor": %d, "build": %d}', $MAJOR $MINOR $BUILD > target/web/florence/assets/version.json
else
  echo $REV > artifacts/revision
fi

mv target/* artifacts/
