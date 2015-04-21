#!/bin/bash

export WEB_DIRECTORY="./src/main/web/florence"

npm --prefix $WEB_DIRECTORY install
npm --prefix $WEB_DIRECTORY run build-js
npm --prefix $WEB_DIRECTORY run build-templates