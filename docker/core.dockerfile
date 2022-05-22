FROM nginx:latest

#dependencies
RUN apt-get update
RUN apt-get install xz-utils wget sqlite3 libsqlite3-dev python3 python3-dev -y

#set dir
WORKDIR /var/elemental

#install node
RUN wget -nv https://nodejs.org/dist/v16.15.0/node-v16.15.0-linux-x64.tar.xz
RUN tar -xf node-v16.15.0-linux-x64.tar.xz
RUN rm -rf node-v16.15.0-linux-x64.tar.xz
ENV PATH="/var/elemental/node-v16.15.0-linux-x64/bin:${PATH}"

#copy our files
COPY ui.editor /var/elemental/ui.editor
COPY service.api /var/elemental/service.api
COPY support.documentation /var/elemental/support.documentation
COPY service.identity.idm /var/elemental/service.identity.idm
COPY service.identity.idp /var/elemental/service.identity.idp
COPY service.interface /var/elemental/service.interface
COPY service.integration /var/elemental/service.integration
COPY service.kernel /var/elemental/service.kernel
COPY service.messaging /var/elemental/service.messaging
COPY service.processes /var/elemental/service.processes
COPY service.rules /var/elemental/service.rules
COPY service.scheduling /var/elemental/service.scheduling
COPY support.lib /var/elemental/support.lib
COPY service.data /var/elemental/service.data

#copy our scripts
COPY scripts/elemental-start.sh /var/elemental
COPY scripts/setup.sh /var/elemental
COPY scripts/clean.sh /var/elemental

#copy our config
COPY config/nginx.conf.template /etc/nginx

#set perms
RUN chmod 755 *.sh

#run our setup
RUN ./clean.sh && ./setup.sh

#set environment
ENV DEFAULT_PROTOCOL="http"
ENV KERNEL_HOST="kernel.elementalsystem.org"
ENV ADMIN_HOST="admin.elementalsystem.org"
ENV API_HOST="api.elementalsystem.org"
ENV INTEGRATION_HOST="integration.elementalsystem.org"
ENV INTERFACE_HOST="interface.elementalsystem.org"
ENV STORAGE_HOST="storage.elementalsystem.org"
ENV RULES_HOST="rules.elementalsystem.org"
ENV IDENTITY_HOST="identity.elementalsystem.org"
ENV QUEUE_HOST="queues.elementalsystem.org"

#run our app
CMD ["./elemental-start.sh"]