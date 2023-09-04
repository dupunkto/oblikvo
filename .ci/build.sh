#!/usr/bin/env bash

rm -rf dist/*

esbuild src/main.ts --bundle --minify --sourcemap --outfile=dist/dist/main.js
cp index.html dist/index.html

