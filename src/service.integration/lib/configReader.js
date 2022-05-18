const configReader = function(fs, path, glob) {
    this.fs = fs;
    this.path = path;
    this.glob = glob;
};

configReader.prototype._findConfigInDir = function(dir) {
    return new Promise((resolve, reject) => {
        this.glob(this.path.join(process.cwd(), dir, '**/*.json'), (err, files) => {
            if (err) {
                return reject(err);
            }

            return resolve(files);
        });
    });
};

configReader.prototype._readIntegrationConfig = function(file) {
    return new Promise((resolve, reject) => {
        this.fs.readFile(file, (err, content) => {
            if (err) {
                return reject(err);
            }

            let config = null;
            try {
                config = JSON.parse(content.toString('utf8'));
            } catch(e) {
                console.error(`Could not parse integration definition in ${file}`);
            }

            if (config === null) {
                return reject(new Error(`Unable to parse config file ${file}`));
            }

            return resolve(config);
        });
    });
};

configReader.prototype.readConfigFromDir = function(dir) {
    let integrations = {};

    return this._findConfigInDir(dir).then((files) => {
        const doNext = () => {
            if (files.length === 0) {
                return Promise.resolve();
            }

            const fileName = files.pop();

            return this._readIntegrationConfig(fileName).then((config) => {
                integrations[this.path.basename(fileName).split('.').slice(0, -1).join('.')] = config;

                return doNext();
            });
        };

        return doNext().then(() => {
            return Promise.resolve(integrations);
        });
    });
};

module.exports = function(fs, path, glob) {
    if (!fs) {
        fs = require('fs');
    }

    if (!path) {
        path = require('path');
    }

    if (!glob) {
        glob = require('glob');
    }

    return new configReader(fs, path, glob);
};