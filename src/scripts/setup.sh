#!/usr/bin/env bash

set -e

#install dependencies
folders=("service.api" "service.data" "service.identity.idm" "service.identity.idp" "service.integration" "service.interface" "service.kernel" "service.messaging" "service.processes" "service.rules" "service.scheduling" "support.lib" "ui.editor")

for i in "${!folders[@]}"; do
	cd ${folders[i]} && npm i --unsafe-perm
	cd ../
done