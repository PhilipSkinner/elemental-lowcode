#!/usr/bin/env bash

#install dependencies
cd ./src/ui.editor && npm i --unsafe-perm=true --allow-root
cd ../..
cd ./src/service.api && npm i --unsafe-perm=true --allow-root
cd ../..
cd ./src/service.integration && npm i --unsafe-perm=true --allow-root
cd ../..
cd ./src/service.interface && npm i --unsafe-perm=true --allow-root
cd ../..
cd ./src/service.kernel && npm i --unsafe-perm=true --allow-root
cd ../..
cd ./src/service.data && npm i --unsafe-perm=true --allow-root
cd ../..
cd ./src/service.rules && npm i --unsafe-perm=true --allow-root
cd ../..
cd ./src/service.processes && npm i --unsafe-perm=true --allow-root
cd ../..
cd ./src/service.identity.idp && npm i --unsafe-perm=true --allow-root
cd ../..
cd ./src/service.identity.idm && npm i --unsafe-perm=true --allow-root
cd ../..
cd ./src/service.messaging && npm i --unsafe-perm=true --allow-root
cd ../..
cd ./src/service.blob && npm i --unsafe-perm=true --allow-root
cd ../..
cd ./src/support.lib && npm i --unsafe-perm=true --allow-root
cd ../..