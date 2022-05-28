#!/usr/bin/env bash

#remove all deps
cd ./src/ui.editor && rm -rf node_modules
cd ../..
cd ./src/service.api && rm -rf node_modules
cd ../..
cd ./src/service.integration && rm -rf node_modules
cd ../..
cd ./src/service.interface && rm -rf node_modules
cd ../..
cd ./src/service.kernel && rm -rf node_modules
cd ../..
cd ./src/service.data && rm -rf node_modules
cd ../..
cd ./src/service.rules && rm -rf node_modules
cd ../..
cd ./src/service.processes && rm -rf node_modules
cd ../..
cd ./src/service.identity.idp && rm -rf node_modules
cd ../..
cd ./src/service.identity.idm && rm -rf node_modules
cd ../..
cd ./src/service.messaging && rm -rf node_modules
cd ../..
cd ./src/service.blob && rm -rf node_modules
cd ../..
cd ./src/support.lib && rm -rf node_modules
cd ../..
rm -rf node_modules
rm -rf .nyc_output
rm -rf coverage
rm -rf kernel/.sources
rm -rf kernel/.queues
rm -rf kernel/.store
rm -rf kernel/.sessions