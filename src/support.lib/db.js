const models = {};

const db = function(fs, path, glob, sqlStore, dataResolver, environmentService) {
    this.fs                   = fs;
    this.path                 = path;
    this.glob                 = glob;
    this.sqlStore             = sqlStore;
    this.dataResolver         = dataResolver;
    this.environmentService   = environmentService;

    try {
        this.mainConfig = JSON.parse(this.fs.readFileSync(this.path.join(process.env.DIR, 'main.json')));
    } catch(e) {
        this.mainConfig = {};
    }

    if (process.env.MYSQL_CONNECTION_STRING) {
        this.mainConfig = {
            storageEngine: 'sql',
            connectionString: process.env.MYSQL_CONNECTION_STRING
        };
    }
};

db.prototype.generateModel = function(name) {
    //needs to be sync for first time runs
    const definition = JSON.parse(this.fs.readFileSync(this.path.join(__dirname, 'types', `${name}.json`)));

    //now determine the storage engine
    let engine = null;

    definition.storageEngine = this.mainConfig.storageEngine;

    if (!definition.connectionString) {
        definition.connectionString = this.mainConfig.connectionString;
    }

    //resolve our values
    definition.connectionString = this.dataResolver.detectValues(definition.connectionString, {
        secrets : this.environmentService.listSecrets()
    }, {}, true);

    engine = this.sqlStore(definition.connectionString, definition);

    return {
        engine      : engine
    };
};

db.prototype.getModel = function(name) {
    if (!models[name]) {
        models[name] = this.generateModel(name);
    }

    return models[name];
};

db.prototype.generateClass = function() {
    const self = this;

    class SequelizeAdapter {
        constructor(name) {
            this.name   = `idp__${name.toLowerCase()}`;
            this.model  = self.getModel(this.name.toLowerCase());
        }

        async upsert(id, data, expiresIn) {
            if (!this.model.engine) {
                return new Promise((resolve) => {
                    setTimeout(resolve, 500);
                }).then(() => {
                    return this.upsert(id, data, expiresIn);
                });
            }

            let resource = {
                data : JSON.stringify(data, null, 4)
            };

            if (expiresIn) {
                resource.expiresAt = new Date(Date.now() + (expiresIn * 1000));
            }

            if (data.grantId) {
                resource.grantId = data.grantId;
            }

            if (data.userCode) {
                resource.userCode = data.userCode;
            }

            if (data.uid) {
                resource.uid = data.uid;
            }

            if (data.username) {
                resource.username = data.username;
            }

            return this.model.engine.createResource(this.name, id, resource).catch((err) => {
                if (err.toString().indexOf('Resource already exists') !== -1) {
                    return this.model.engine.updateResource(this.name, id, resource);
                }

                return Promise.reject(err);
            });
        }

        async fetch() {
            if (!this.model.engine) {
                return new Promise((resolve) => {
                    setTimeout(resolve, 500);
                }).then(() => {
                    return this.fetch();
                });
            }

            return this.model.engine.getResources(this.name, 1, 10).then((resources) => {
                return Promise.resolve(resources.map((r) => {
                    r.data = JSON.parse(r.data);
                    return r;
                }));
            });
        }

        async find(id) {
            if (!this.model.engine) {
                return new Promise((resolve) => {
                    setTimeout(resolve, 500);
                }).then(() => {
                    return this.find(id);
                });
            }

            const found = await this.model.engine.getResource(this.name, id);

            if (!found) {
                return undefined;
            }

            found.consumed = false;
            try {
                found.data = JSON.parse(found.data);
            } catch(e) {
                found.data = null;
            }

            if (found.consumedAt) {
                found.data.consumed = true;
            }

            return found.data;
        }

        async findByUsername(username) {
            if (!this.model.engine) {
                return new Promise((resolve) => {
                    setTimeout(resolve, 500);
                }).then(() => {
                    return this.find(username);
                });
            }

            const found = await this.model.engine.getResources(this.name, 1, 1, [
                {
                    path : '$.username',
                    value : username
                }
            ]);

            if (!found || found.length === 0) {
                return undefined;
            }

            found[0].consumed = false;
            try {
                found[0].data = JSON.parse(found[0].data);
            } catch(e) {
                found[0].data = null;
            }

            if (found[0].consumedAt) {
                found[0].data.consumed = true;
            }

            return found[0].data;
        }

        async findByUserCode(userCode) {
            if (!this.model.engine) {
                return new Promise((resolve) => {
                    setTimeout(resolve, 500);
                }).then(() => {
                    return this.findByUserCode(userCode);
                });
            }

            const found = await this.model.engine.getResources(this.name, 1, 1, [
                {
                    path : '$.userCode',
                    value : userCode
                }
            ]);

            if (!found || found.length === 0) {
                return undefined;
            }

            found[0].consumed = false;
            try {
                found[0].data = JSON.parse(found[0].data);
            } catch(e) {
                found[0].data = null;
            }

            if (found[0].consumedAt) {
                found[0].data.consumed = true;
            }

            return found[0].data;
        }

        async findByUid(uid) {
            if (!this.model.engine) {
                return new Promise((resolve) => {
                    setTimeout(resolve, 500);
                }).then(() => {
                    return this.findByUid(uid);
                });
            }

            const found = await this.model.engine.getResources(this.name, 1, 1, [
                {
                    path : '$.uid',
                    value : uid
                }
            ]);

            if (!found || found.length === 0) {
                return undefined;
            }

            found[0].consumed = false;
            try {
                found[0].data = JSON.parse(found[0].data);
            } catch(e) {
                found[0].data = null;
            }
            if (found[0].consumedAt) {
                found[0].data.consumed = true;
            }

            return found[0].data;
        }

        async destroy(id) {
            if (!this.model.engine) {
                return new Promise((resolve) => {
                    setTimeout(resolve, 500);
                }).then(() => {
                    return this.destroy(id);
                });
            }

            return this.model.engine.deleteResource(this.name, id);
        }

        async consume(id) {
            if (!this.model.engine) {
                return new Promise((resolve) => {
                    setTimeout(resolve, 500);
                }).then(() => {
                    return this.consume(id);
                });
            }

            return this.model.engine.getResource(this.name, id).then((resource) => {
                resource.consumedAt = new Date();

                return this.model.engine.updateResource(this.name, id, resource);
            });
        }

        async revokeByGrantId(grantId) {
            if (!this.model.engine) {
                return new Promise((resolve) => {
                    setTimeout(resolve, 500);
                }).then(() => {
                    return this.revokeByGrantId(grantId);
                });
            }

            const found = this.model.engine.getResources(this.name, 1, 1, [
                {
                    path : '$.grantId',
                    value : grantId
                }
            ]);

            if (found && found.length > 0) {
                return this.model.engine.deleteResource(this.name, found[0].id);
            }

            return Promise.resolve();
        }

        static async connect() {
            return Promise.resolve();
        }
    }

    return SequelizeAdapter;
};

module.exports = function(fs, path, glob, sqlStore, dataResolver, environmentService) {
    if (!fs) {
        fs = require('fs');
    }

    if (!path) {
        path = require('path');
    }

    if (!glob) {
        glob = require('glob');
    }

    if (!sqlStore) {
        sqlStore = require('./stores/sqlStore');
    }

    if (!dataResolver) {
        dataResolver = require('./dataResolver')();
    }

    if (!environmentService) {
        environmentService = require('./environmentService')();
    }

    const instance = new db(fs, path, glob, sqlStore, dataResolver, environmentService);

    return instance.generateClass();
};