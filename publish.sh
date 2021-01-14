#!/bin/bash

set -e
rollup -c;
npm version patch;
npm publish --registry=https://registry.npmjs.org/;

npx typedoc;

git push origin master;
