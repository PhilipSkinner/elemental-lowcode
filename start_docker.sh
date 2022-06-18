#!/usr/bin/env bash

exec_sql() {
  return $(mysql -h "127.0.0.1" -P 3306 --password="password" -u "root" --raw --batch -s -e "${1}" >> /dev/null 2>&1)
}

docker-compose up core_services

exec_sql "CREATE DATABASE IF NOT EXISTS db"

docker-compose build elemental
docker-compose up -d elemental

xdg-open http://admin.elementalsystem.org