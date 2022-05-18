#!/usr/bin/env bash

set -e

#generate the nginx config
export DOLLAR="$"
envsubst < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

/etc/init.d/nginx restart
cd ./service.kernel && node main.js