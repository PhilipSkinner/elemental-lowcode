#!/usr/bin/env bash

exec_sql() {
  return $(mysql -h "127.0.0.1" -P 3306 --password="password" -u "root" --raw --batch -s -e "${1}" >> /dev/null 2>&1)
}

export MYSQL_CONNECTION_STRING="mysql://root:password@127.0.0.1:3306/db"
export INITIAL_CLIENT_ID=admin
export INITIAL_CLIENT_SECRET=admin-secret
export INITIAL_CLIENT_SCOPES="openid roles offline_access"
export INITIAL_CLIENT_AUTH_REDIRECT=http://localhost:8002/auth
export INITIAL_CLIENT_LOGOUT_REDIRECT=http://localhost:8002
export INITIAL_ROLES="system_admin"
export INITIAL_USER_USERNAME=admin@elementalsystem.org
export INITIAL_USER_PASSWORD=Password1!
export INITIAL_USER_ROLE=system_admin

export ADMIN_CLIENT_ID=$INITIAL_CLIENT_ID
export ADMIN_CLIENT_SECRET=$INITIAL_CLIENT_SECRET

docker-compose up core_services

exec_sql "CREATE DATABASE IF NOT EXISTS db"

xdg-open http://localhost:8002
cd ./src/service.kernel && node main.js