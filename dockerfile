FROM nginx:latest
MAINTAINER me@philip-skinner.co.uk

#dependencies
RUN apt-get update
RUN apt-get install xz-utils wget -y

#set dir
WORKDIR /var/elemental

#install node
RUN wget -nv https://nodejs.org/dist/v12.16.1/node-v12.16.1-linux-x64.tar.xz
RUN tar -xf node-v12.16.1-linux-x64.tar.xz
RUN rm -rf node-v12.16.1-linux-x64.tar.xz
ENV PATH="/var/elemental/node-v12.16.1-linux-x64/bin:${PATH}"

#copy our files
COPY admin /var/elemental/admin
COPY api /var/elemental/api
COPY documentation /var/elemental/documentation
COPY identity /var/elemental/identity
COPY interface /var/elemental/interface
COPY integration /var/elemental/integration
COPY kernel /var/elemental/kernel
COPY messaging /var/elemental/messaging
COPY processes /var/elemental/processes
COPY rules /var/elemental/rules
COPY shared /var/elemental/shared
COPY storage /var/elemental/storage
COPY spec /var/elemental/spec
COPY docker/docker-start.sh /var/elemental
COPY docker/nginx.conf /etc/nginx
COPY setup.sh /var/elemental
COPY clean.sh /var/elemental

#set perms
RUN chmod 755 *.sh

#run our setup
RUN ./clean.sh && ./setup.sh

#copy our initial db
COPY docker/db.sqlite /var/elemental/kernel/.sources/identity/

#set environment
ENV ELEMENTAL_KERNEL_HOST="http://kernel.elementalsystem.org"
ENV ELEMENTAL_ADMIN_HOST="http://admin.elementalsystem.org"
ENV ELEMENTAL_API_HOST="http://api.elementalsystem.org"
ENV ELEMENTAL_INTEGRATION_HOST="http://integration.elementalsystem.org"
ENV ELEMENTAL_INTERFACE_HOST="http://interface.elementalsystem.org"
ENV ELEMENTAL_STORAGE_HOST="http://storage.elementalsystem.org"
ENV ELEMENTAL_RULES_HOST="http://rules.elementalsystem.org"
ENV ELEMENTAL_IDENTITY_HOST="http://identity.elementalsystem.org"
ENV ELEMENTAL_QUEUE_HOST="http://queues.elementalsystem.org"

#run our app
CMD ["./docker-start.sh"]