#!/usr/bin/env bash

rm -rf dist/*

esbuild src/main.ts --bundle --outfile=dist/main.js --watch --serve=4000 --servedir=.
waiter --dev
