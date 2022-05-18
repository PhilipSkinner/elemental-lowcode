const configReader = function(fs, path) {
    this.fs = fs;
    this.path = path;
};

configReader.prototype.readDefinition = function(file) {
    return new Promise((resolve, reject) => {
        this.fs.readFile(this.path.join(process.cwd(), file), (err, content) => {
            if (err) {
                return reject(err);
            }

            let data = null;
            try {
                data = JSON.parse(content);
            } catch(e) {
                data = null;
            }

            if (data == null) {
                return reject(new Error(`Cannot read rules definition ${file}`));
            }

            return resolve(data);
        });
    });
};

module.exports = function(fs, path) {
    if (!fs) {
        fs = require('fs');
    }

    if (!path) {
        path = require('path');
    }

    return new configReader(fs, path);
};