#!/usr/bin/env bash

#install dependencies
cd ./admin && npm i --unsafe-perm=true --allow-root
cd ..
cd ./api && npm i --unsafe-perm=true --allow-root
cd ..
cd ./integration && npm i --unsafe-perm=true --allow-root
cd ..
cd ./interface && npm i --unsafe-perm=true --allow-root
cd ..
cd ./kernel && npm i --unsafe-perm=true --allow-root
cd ..
cd ./storage && npm i --unsafe-perm=true --allow-root
cd ..
cd ./rules && npm i --unsafe-perm=true --allow-root
cd ..
cd ./processes && npm i --unsafe-perm=true --allow-root
cd ..
cd ./identity && npm i --unsafe-perm=true --allow-root
cd ..
cd ./messaging && npm i --unsafe-perm=true --allow-root
cd ..
cd ./shared && npm i --unsafe-perm=true --allow-root
cd ..
npm i --unsafe-perm=true --allow-root