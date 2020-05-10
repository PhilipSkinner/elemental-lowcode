#!/usr/bin/env bash

/etc/init.d/nginx restart
cd ./kernel && node main.js