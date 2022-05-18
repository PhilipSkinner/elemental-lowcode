FROM ubuntu:14.04

RUN mkdir /src
WORKDIR /src

COPY scripts/core_services.sh /src/core_services.sh

ENTRYPOINT bash /src/core_services.sh