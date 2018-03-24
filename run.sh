#!/bin/sh

[ "$(ls -A node_modules)" ] || npm i

node_modules/.bin/babel-node src/server/keramiko/monitor.js
