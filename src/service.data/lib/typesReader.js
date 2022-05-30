const typesReader = function(glob, fs, path) {
    this.glob = glob;
    this.fs = fs;
    this.path = path;
};

typesReader.prototype.findTypes = function(dir) {
    return new Promise((resolve, reject) => {		
        this.glob(this.path.join(process.cwd(), dir, "**/*.json"), (err, files) => {
            if (err) {
                return reject(err);
            }

            return resolve(files);
        });
    });
};

typesReader.prototype.parseType = function(file) {
    return new Promise((resolve, reject) => {
        this.fs.readFile(file, (err, content) => {
            if (err) {
                return reject(err);
            }

            let data = null;
            try {
                data = JSON.parse(content.toString("utf8"));
            } catch(e) {
                data = null;
            }

            if (data === null) {
                return reject(new Error(`Could not parse type file ${file}`));
            }

            return resolve(data);
        });
    });
};

typesReader.prototype.readTypes = function(dir) {
    let allTypes = [];

    return this.findTypes(dir).then((types) => {
        const doNext = () => {
            if (types.length === 0) {
                return Promise.resolve();
            }

            const next = types.pop();

            return this.parseType(next).then((type) => {
                allTypes.push(type);
                return doNext();
            });
        };

        return doNext().then(() => {
            return Promise.resolve(allTypes);
        });
    });
};

module.exports = function(glob, fs, path) {
    if (!glob) {
        glob = require("glob");
    }

    if (!fs) {
        fs = require("fs");
    }

    if (!path) {
        path = require("path");
    }

    return new typesReader(glob, fs, path);
};