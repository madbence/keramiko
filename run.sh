#!/bin/sh

[ "$(ls -A node_modules)" ] || npm i

node -r @babel/polyfill -r @babel/register src/server/keramiko/monitor.js
