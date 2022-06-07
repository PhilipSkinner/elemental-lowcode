#!/bin/bash

services=( 'mysql' 'mailhog')
ports=( '3306' '1025')

checkService () {
  while ! nc -z $1 $2;
  do
    echo waiting for $1 on port $2;
    sleep 5;
  done;
}

for i in "${!services[@]}"; do
  checkService ${services[i]} ${ports[i]}
done

echo All services ready!;