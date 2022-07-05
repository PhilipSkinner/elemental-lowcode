#!/usr/bin/env bash

set -e

#remove dependencies
folders=("service.api" "service.data" "service.identity.idm" "service.identity.idp" "service.integration" "service.interface" "service.kernel" "service.messaging" "service.processes" "service.rules" "service.scheduling" "service.blob" "ui.editor")

for i in "${!folders[@]}"; do	
	cd ${folders[i]} && rm -rf node_modules
	cd ../
done