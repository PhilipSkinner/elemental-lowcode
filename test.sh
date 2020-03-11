#!/usr/bin/env bash

cd ./admin && npm run test
cd ..
cd ./api && npm run test
cd ..
cd ./integration && npm run test
cd ..
cd ./interface && npm run test
cd ..
cd ./kernel && npm run test
cd ..
cd ./storage && npm run test
cd ..
cd ./rules && npm run test
cd ..
cd ./processes && npm run test
cd ..
cd ./identity && npm run test
cd ..
cd ./shared && npm run test