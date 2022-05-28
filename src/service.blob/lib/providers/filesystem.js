const filesystemProvider = function(fs, path, mkdirp, mimeTypes) {
    this.fs         = fs;
    this.path       = path;
    this.mkdirp     = mkdirp;
    this.mimeTypes  = mimeTypes;
};

filesystemProvider.prototype.ensureDir = function(dir) {
    return this.mkdirp(dir);
};

filesystemProvider.prototype._getFullPath = function(config, p) {
    return this.path.join(process.cwd(), process.env.DIR, config.mechanism.path, p);
};

filesystemProvider.prototype._fileStats = function(p) {
    return this.fs.statSync(p);
};

filesystemProvider.prototype.init = function(config) {
    return this.ensureDir(this._getFullPath(config, ''));
};

filesystemProvider.prototype._list = function(config, dir) {
    const rootPath = this._getFullPath(config, '/');

    return this.ensureDir(dir).then(() => {
        return new Promise((resolve, reject) => {
            this.fs.opendir(dir, (err, dirhandle) => {
                if (err) {
                    return reject(err);
                }

                let next = dirhandle.readSync();

                const list = [];

                //add our traversal
                if (dir !== rootPath) {
                    list.push({
                        name : '..',
                        type : 'traverse_up',
                        size : '-',
                        full_path : this.path.relative(rootPath, this.path.dirname(dir))
                    });
                }

                while (next !== null) {
                    const filePath = this.path.join(dir, next.name);
                    list.push(this._getDetails(config, filePath));
                    next = dirhandle.readSync();
                }

                dirhandle.close();

                Promise.all(list).then(resolve).catch(reject);
            });
        });
    });
};

filesystemProvider.prototype._getDetails = function(config, file, includeChildren) {
    return new Promise((resolve, reject) => {
        const rootPath = this._getFullPath(config, '/');
        const stats = this._fileStats(file);

        const ret = {
            name            : this.path.basename(file),
            type            : stats.isDirectory() ? 'directory' : 'file',
            size            : stats.isDirectory() ? '-' : stats.size,
            full_path       : this.path.relative(rootPath, file),
            last_accessed   : stats.atime,
            last_modified   : stats.mtime,
            created         : stats.birthtime,
            mime_type       : this.mimeTypes.lookup(file)
        };

        if (!includeChildren || !stats.isDirectory()) {
            return resolve(ret);
        }

        this._list(config, file).then((children) => {
            ret.children = children;

            resolve(ret);
        }).catch(reject);
    });
};

filesystemProvider.prototype.getDetails = function(config, file) {
    const fullPath = this._getFullPath(config, file);

    return this._getDetails(config, fullPath, true);
};

filesystemProvider.prototype.get = function(config, file) {
    const fullPath = this._getFullPath(config, file);

    return new Promise((resolve, reject) => {
        this.fs.readFile(fullPath, (err, data) => {
            if (err) {
                return reject(err);
            }

            return resolve(data);
        });
    });
};

filesystemProvider.prototype.createFolder = function(config, folder) {
    const folderPath = this._getFullPath(config, folder);

    return this.ensureDir(folderPath);
};

filesystemProvider.prototype.put = function(config, file, data) {
    const filePath = this._getFullPath(config, file);

    return this.ensureDir(this.path.dirname(filePath)).then(() => {
        return new Promise((resolve, reject) => {
            this.fs.writeFile(filePath, data, (err) => {
                if (err) {
                    return reject(err);
                }

                return resolve();
            });
        });
    });
};

filesystemProvider.prototype.delete = function(config, file) {
    const filePath = this._getFullPath(config, file);

    return this.ensureDir(this.path.dirname(filePath)).then(() => {
        return new Promise((resolve, reject) => {
            this.fs.remove(filePath, (err) => {
                if (err) {
                    return reject(err);
                }

                return resolve();
            });
        });
    });
};

module.exports = function(fs, path, mkdirp, mimeTypes) {
    if (!fs) {
        fs = require('fs-extra');
    }

    if (!path) {
        path = require('path');
    }

    if (!mkdirp) {
        mkdirp = require('mkdirp');
    }

    if (!mimeTypes) {
        mimeTypes = require('mime-types');
    }

    return new filesystemProvider(fs, path, mkdirp, mimeTypes);
};