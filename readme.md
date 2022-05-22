<a href="https://elementalsystem.org">
	<img src="https://elementalsystem.org/src/support.documentation/images/logo.png" alt="Elemental logo" title="Elemental" align="right" height="60"/>
</a>

# Elemental low-code platform

[![Build Status](https://travis-ci.com/PhilipSkinner/elemental-lowcode.svg?branch=master)](https://travis-ci.com/github/PhilipSkinner/elemental-lowcode)
[![Coverage Status](https://coveralls.io/repos/github/PhilipSkinner/elemental-lowcode/badge.svg?branch=master)](https://coveralls.io/github/PhilipSkinner/elemental-lowcode?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c2fa09bdad924a0d9b290b282a4427cc)](https://www.codacy.com/manual/PhilipSkinner/elemental-lowcode?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=PhilipSkinner/elemental-lowcode&amp;utm_campaign=Badge_Grade)
[![GitHub issues](https://img.shields.io/github/issues/PhilipSkinner/elemental-lowcode.svg)](https://github.com/PhilipSkinner/elemental-lowcode/issues)
[![GitHub forks](https://img.shields.io/github/forks/PhilipSkinner/elemental-lowcode.svg)](https://github.com/PhilipSkinner/elemental-lowcode/network)
[![GitHub stars](https://img.shields.io/github/stars/PhilipSkinner/elemental-lowcode.svg)](https://github.com/PhilipSkinner/elemental-lowcode/stargazers)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/PhilipSkinner/elemental-lowcode/pulls)

A standards based, open low-code development platform built on nodejs with the ability to fallback to writing raw nodejs code when the provided tools cannot solve your problems.

Currently ships with:

* JSON Schema defined RESTful APIs
* Simple async messaging queues
* Integrations to external systems
* API builder
* Rulesets builder
* Interface/website builder
* OIDC/OAuth2.0 Identity Provider & Identity Management

## Table of Contents

- [Installation](#installation)
	- [Docker](#docker)
	- [From source](#from-source)
	- [Database support](#databases)
- [Documentation](#documentation)
- [Examples](#examples)
- [Hosting](#hosting)
	- [Secrets](#secrets)
- [Contributing](#contributing)
- [Authors](#authors)
- [Support](#support)
- [Links](#links)
- [License](#license)

## Installation

Installation can done using the prebuilt docker image or using the latest code from master.

### Docker

To use the docker image you'll need to boot a SQL server and configure the system:

```
services:
  elemental:
    image: philipskinner/elemental:latest
    environment:
      MYSQL_CONNECTION_STRING: "mysql://root:password@mysql:3306/db"
      INITIAL_CLIENT_ID: admin
      INITIAL_CLIENT_SECRET: admin-secret
      INITIAL_CLIENT_SCOPES: "openid roles offline_access"
      INITIAL_CLIENT_AUTH_REDIRECT: http://admin.elementalsystem.org/auth
      INITIAL_CLIENT_LOGOUT_REDIRECT: http://admin.elementalsystem.org
      INITIAL_ROLES: "system_admin"
      INITIAL_USER_USERNAME: admin@elementalsystem.org
      INITIAL_USER_PASSWORD: Password1!
      INITIAL_USER_ROLE: system_admin
      ADMIN_CLIENT_ID: admin
      ADMIN_CLIENT_SECRET: admin-secret
    ports:
      - 80:80
    depends_on:
      - mysql      
    networks:
      - all  

  mysql:
    image: mysql
    command: --default-authentication-plugin=mysql_native_password
    ports:
      - 3306:3306
    environment:
      MYSQL_ROOT_PASSWORD: password
    volumes:
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - all

networks:
  all:
```

; then open a browser and point it at (http://admin.elementalsystem.org).

The default administration login details are configurable using the `INITIAL_USER_USERNAME` and `INITIAL_USER_PASSWORD` env vars. If you used the docker-compose setup above you'll want to use:

* Username: admin@elementalsystem.org
* Password: Password1!

The docker image uses several pre-defined hostnames for the service, each of which resolves to 127.0.0.1:

* Kernel 			- http://kernel.elementalsystem.org
* Admin 			- http://admin.elementalsystem.org
* API 				- http://api.elementalsystem.org
* Integration 		- http://integration.elementalsystem.org
* Interface 		- http://interface.elementalsystem.org
* Storage API 		- http://storage.elementalsystem.org
* Rules 			- http://rules.elementalsystem.org
* Identity Provider - http://identity.elementalsystem.org
* Messaging/queues 	- http://queues.elementalsystem.org

### From source

Follow these steps to build and run from source:

```
$> git clone https://github.com/PhilipSkinner/elemental-lowcode.git elemental-lowcode
$> cd elemental-lowcode && ./setup.sh
$> ./start.sh
```

You can directly run the kernel by executing the main.js file within the kernel directory:

```
$> cd src/service.kernel
$> node main.js
```

The following usage options are available when you do this:

```
Usage: node main.js [OPTIONS]

Options:
	--sources [SOURCE_DIR]		Sets the directory where your Elemental application
                                        source code lives.
```

The admin interface will attempt to open on http://localhost:8002. Use the following default credentials:

* Username: admin@elementalsystem.org
* Password: Password1!

### Database support

Elemental supports persistence of:

* Authentication details
* Data types
* Message queues
* Website session state

; with a selection of storage options. These storage options are:

* SQL:
	* sqlite
	* postgres
	* mysql
	* mariadb
	* mssql

## Documentation

Documentation is available within Elemental:

![In app documentation](https://elementalsystem.org/src/support.documentation/images/documentation-screenshot.png)

; or you can read it on the [Elemental Documentation](https://elementalsystem.org/src/support.documentation) website.

## Examples

Examples can be found in the [elemental-examples repository](https://github.com/PhilipSkinner/elemental-examples).

To use the examples clone the repository locally then set Elemental to run from a specific example directory:

```
$> git clone https://github.com/PhilipSkinner/elemental-lowcode.git elemental-lowcode
$> git clone https://github.com/PhilipSkinner/elemental-examples.git elemental-examples
$> cd elemental-lowcode && ./setup.sh
$> cd kernel && node main.js --sources ../../elemental-examples/todo
```

; then open the admin interface on [http://localhost:8002](http://localhost:8002). Each example comes with an admin user with the following credentials:

* Username: admin
* Password: admin

## Hosting

The recommended approach for deploying your application is to build on the dockerhub image. The following is an example dockerfile that builds and configures Elemental with a set of Elemental applications:

```
FROM philipskinner/elemental:master

#set dir
WORKDIR /var/elemental

#copy our project sources
COPY my-sources /var/elemental/service.kernel/.sources

#set environment
COPY nginx.conf /etc/nginx
ENV KERNEL_HOST="http://kernel.mysite.com"
ENV ADMIN_HOST="http://admin.mysite.com"
ENV API_HOST="http://api.mysite.com"
ENV INTEGRATION_HOST="http://integration.mysite.com"
ENV INTERFACE_HOST="http://interface.mysite.com"
ENV STORAGE_HOST="http://storage.mysite.com"
ENV RULES_HOST="http://rules.mysite.com"
ENV IDENTITY_HOST="http://identity.mysite.com"
ENV QUEUE_HOST="http://queues.mysite.com"

#run our app
CMD ["./docker-start.sh"]
```

If you want to run the system outside of a docker container you must set the following environmental variables on your system:

* KERNEL_HOST
* ADMIN_HOST
* API_HOST
* INTEGRATION_HOST
* INTERFACE_HOST
* STORAGE_HOST
* RULES_HOST
* IDENTITY_HOST
* QUEUE_HOST

Each of these needs to be a valid hostname that resolves to the relevant Elemental service.

### Secrets

Elemental has built in support for secrets management. Secrets can be configured within your applications and then the secrets definition can be deployed on a per environment basis - outside of version control of your main application.

Secrets can be scoped for global access or restricted to a specific Elemental subsystem.

To deploy secrets you need to copy a JSON file for each secret into the kernel/.secrets directory. Each JSON file should follow this format:

```
{
    "value": "my-secret-value"
}
```

; where the filename is `secret-name.secret.json` within the kernel/.secrets directory. You can copy these at build time within your dockerfile:

```
COPY my-secrets/*.json /var/elemental/kernel/.secrets/
```

## Contributing

Contributions, code or otherwise, are very welcome!

To contribute a code change:

1. Fork the master branch
2. Carry out your code changes
3. Run the unit tests - `./test.sh`
4. Submit a pull request following pull request template

To contribute a none code change raise a ticket on the [original repository](https://github.com/PhilipSkinner/elemental-lowcode).

## Authors

| [![Philip Skinner](https://avatars2.githubusercontent.com/u/879532?s=160&v=4)](https://www.linkedin.com/in/philipskinner/) 	|
|:---------------------------------------------------------------------------------------------------------:	|
|                                            **Philip Skinner**                                            	|

## Support

Raise a ticket on the [repository](https://github.com/PhilipSkinner/elemental-lowcode) describing the issue in as much detail as possible.

Alternatively reach out to me@philip-skinner.co.uk and I'll reply as soon as I can.

## Links

More information about Elemental can be found at:

* [Github Repo](https://github.com/PhilipSkinner/elemental-lowcode)
* [Official Website](https://elementalsystem.org)
* [Dockerhub image](https://hub.docker.com/r/philipskinner/elemental)

The following are standards that Elemental attempts to follow:

* [OpenID Connect](https://openid.net/connect/)
* [JSON Web Token](https://en.wikipedia.org/wiki/JSON_Web_Token)
* [Role-based access control](https://en.wikipedia.org/wiki/Role-based_access_control)
* [JSON Schema](https://json-schema.org/)
* [JSON Path](https://goessner.net/articles/JsonPath/index.html#e2)

Elemental relies upon several other projects, notable ones are:

* [OIDC-Provider](https://github.com/panva/node-oidc-provider)
* [Sequelize](https://sequelize.org/)

## License

Elemental is licensed under the terms of the MIT License and is free to use and free to modify.