#!/bin/bash

set -e
npx typedoc src/index.ts;
rollup -c;
npm version patch;
npm publish --registry=https://registry.npmjs.org/;
