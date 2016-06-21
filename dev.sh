#!/usr/bin/env bash

# Install NPM dependencies
cd src/main/web/florence && npm install --no-bin-links

# Run main NPM watch script
npm run watch
