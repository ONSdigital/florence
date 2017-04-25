#!/bin/bash -eux

REV=$(cat artifacts/revision)

if ! [[ $REV =~ ^[0-9]+\.[0-9]+\.[0-9]+(\-rc[0-9]+)?$ ]]; then
  REV=$REV-1.0.0
fi

tar cvzf build/$REV.tar.gz -C artifacts .
