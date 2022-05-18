const definitionProvider = function(fs, path) {
    this.fs = fs;
    this.path = path;
};

definitionProvider.prototype._parseConfig = function(file) {
    return new Promise((resolve, reject) => {
        this.fs.readFile(file, (err, content) => {
            if (err) {
                return reject(err);
            }

            let config = null;
            try {
                config = JSON.parse(content);
            } catch(e) {
                config = null;
            }

            if (config === null) {
                return reject(new Error(`Cannot read message queue definition ${file}`));
            }

            return resolve(config);
        });
    });
};

definitionProvider.prototype._getClient = function(config) {
    if (!config.client_id) {
        return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
        this.fs.readFile(this.path.join(process.env.DIR, '../identity', config.client_id + '.client.json'), (err, content) => {
            if (err) {
                return reject(err);
            }

            let client = null;
            try {
                client = JSON.parse(content);
            } catch(e) {
                client = null;
            }

            if (client === null) {
                return reject(new Error('Cannot read client definition'));
            }

            return resolve(client);
        });
    });
};

definitionProvider.prototype._readHandler = function(file, config) {
    return new Promise((resolve, reject) => {
        try {
            let module = this.path.join(`${file.slice(0, -5)}.js`);
            delete require.cache[require.resolve(module)];
            config.handler = require(module);
        } catch(e) {
            console.log(e);
            return reject(e);
        }

        return resolve();
    });
};

definitionProvider.prototype.fetchDefinition = function(file) {
    let config = null;
    return this._parseConfig(file).then((_config) => {
        config = _config;
        //read in our service files
        return this._readHandler(file, config);
    }).then(() => {
        return this._getClient(config);
    }).then((client) => {
        config.client = client;
        return Promise.resolve(config);
    }).catch((err) => {
        return Promise.reject(err);
    });
};

module.exports = function(fs, path) {
    if (!fs) {
        fs = require('fs');
    }

    if (!path) {
        path = require('path');
    }

    return new definitionProvider(fs, path);
};