const readLastLines = function(fs) {
    this.fs = fs;
};

readLastLines.prototype.read = function(path, lastSeenLine) {
    return new Promise((resolve, reject) => {
        this.fs.readFile(path, (err, data) => {
            if (err) {
                return reject(err);
            }

            let lines = data.toString('utf8').split('\n');
            let ret = {};

            for (var i = lastSeenLine; i < lines.length - 1; i++) {
                ret[i + ''] = lines[i];
            }

            return resolve(ret);
        });
    });
};

module.exports = function(fs) {
    if (!fs) {
        fs = require('fs');
    }

    return new readLastLines(fs);
};