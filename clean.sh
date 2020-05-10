#!/usr/bin/env bash

#remove all deps
cd ./admin && rm -rf node_modules
cd ..
cd ./api && rm -rf node_modules
cd ..
cd ./integration && rm -rf node_modules
cd ..
cd ./interface && rm -rf node_modules
cd ..
cd ./kernel && rm -rf node_modules
cd ..
cd ./storage && rm -rf node_modules
cd ..
cd ./rules && rm -rf node_modules
cd ..
cd ./processes && rm -rf node_modules
cd ..
cd ./identity && rm -rf node_modules
cd ..
cd ./shared && rm -rf node_modules
cd ../
rm -rf node_modules
rm -rf .nyc_output
rm -rf coverage
rm -rf kernel/.sources