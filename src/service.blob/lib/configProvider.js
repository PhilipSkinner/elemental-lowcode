const configProvider = function(path, glob, fs) {
    this.path = path;
    this.glob = glob;
    this.fs   = fs;
};

configProvider.prototype.getBlobStores = function(dir) {
    return new Promise((resolve, reject) => {
        this.glob(this.path.join(process.cwd(), dir, "**/*.store.json"), (err, definitions) => {
            if (err) {
                return reject(err);
            }

            return resolve(definitions);
        });
    });
};

configProvider.prototype.loadStore = function(store) {
    return new Promise((resolve, reject) => {
        this.fs.readFile(store, (err, raw) => {
            if (err) {
                return reject(err);
            }

            let data = null;
            try {
                data = JSON.parse(raw);
            } catch(e) {
                return reject(new Error('Could not load store, invalid JSON detected'));
            }

            return resolve(data);
        });
    });
};

module.exports = function(path, glob, fs) {
    if (!path) {
        path = require('path');
    }

    if (!glob) {
        glob = require('glob');
    }

    if (!fs) {
        fs = require('fs');
    }

    return new configProvider(path, glob, fs);
};