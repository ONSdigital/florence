#!/bin/bash

if [[ $(docker inspect --format="{{ .State.Running }}" florence) == "false" ]]; then
  exit 1;
fi
