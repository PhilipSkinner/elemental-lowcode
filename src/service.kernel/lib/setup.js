const setup = function(mkdirp, path, fs) {
    this.mkdirp = mkdirp;
    this.path 	= path;
    this.fs 	= fs;
};

setup.prototype.ensureDir = function(dir) {
    return this.mkdirp(dir);
};

setup.prototype.ensureFile = function(file, content) {
    return new Promise((resolve, reject) => {
        this.fs.stat(file, (err) => {
            if (!err) {
                return resolve();
            }

            this.fs.writeFile(file, content, (err) => {
                if (err) {
                    return reject(err);
                }

                return resolve();
            });
        });
    });
};

setup.prototype.setupEnvironment = function(directories) {
    return Promise.all(Object.keys(directories).map((d) => {
        return this.ensureDir(directories[d]);
    })).then(() => {
        return this.ensureFile(this.path.join(directories.services, "package.json"), JSON.stringify({
            dependencies : {}
        }, null, 4));
    });
};

module.exports = function(mkdirp, path, fs) {
    if (!mkdirp) {
        mkdirp = require("mkdirp");
    }

    if (!path) {
        path = require("path");
    }

    if (!fs) {
        fs = require("fs");
    }

    return new setup(mkdirp, path, fs);
};