#!/usr/bin/env bash

set -e

./clean.sh
./setup.sh

cd spec && npm i

npm run test
npm run report