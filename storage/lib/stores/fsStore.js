const fsStore = function(dir, fs, path) {
	this.dir 	= dir;
	this.fs 	= fs;
	this.path 	= path;
};

fsStore.prototype.ensureDir = function(dir) {
	return new Promise((resolve, reject) => {
		this.fs.stat(dir, (err, stats) => {
			if (err) {
				return this.fs.mkdir(dir, (err) => {
					if (err) {
						return reject(err);
					}

					return resolve();
				});
			}

			return resolve();
		});
	});
};

fsStore.prototype.initType = function(type) {
	return this.ensureDir(this.dir).then(() => {
		return this.ensureDir(this.path.join(this.dir, type))
	});
};

fsStore.prototype.getDetails = function(type) {
	return this.initType(type).then(() => {
		return new Promise((resolve, reject) => {
			this.fs.readdir(this.path.join(this.dir, type), (err, dir) => {
				if (err) {
					return reject(err);
				}

				return resolve({
					count : dir.length
				});
			});
		});
	});
};

fsStore.prototype.getResources = function(type, start, count) {
	if (!start) {
		start = 1;
	}

	if (!count) {
		count = 5;
	}

	return this.initType(type).then(() => {
		return new Promise((resolve, reject) => {
			this.fs.readdir(this.path.join(this.dir, type), (err, dir) => {
				if (err) {
					return reject(err);
				}

				let selection = dir.slice(start - 1, count);

				return resolve(selection.map((s) => {
					return {
						id : s
					};
				}));
			});
		});
	});
};

fsStore.prototype.getResource = function(type, id) {
	return this.initType(type).then(() => {
		return new Promise((resolve, reject) => {
			this.fs.readFile(this.path.join(this.dir, type, id), (err, content) => {
				if (err) {
					return resolve(null);
				}

				let object = JSON.parse(content.toString('utf8'));
				object.id = id;
				return resolve(object);
			});
		});
	});
};

fsStore.prototype.createResource = function(type, id, data) {
	return this.getResource(type, id).then((resource) => {
		if (resource) {
			return Promise.reject(new Error('Resource already exists'));
		}

		return new Promise((resolve, reject) => {
			this.fs.writeFile(this.path.join(this.dir, type, id), JSON.stringify(data, null, 4), (err) => {
				if (err) {
					return resolve(false);
				}

				return resolve(true);
			});
		});
	});
};

fsStore.prototype.updateResource = function(type, id, data) {
	return this.getResource(type, id).then((resource) => {
		if (!resource) {
			return Promise.reject(new Error('Resource does not exist'));
		}

		return new Promise((resolve, reject) => {
			this.fs.writeFile(this.path.join(this.dir, type, id), JSON.stringify(data, null, 4), (err) => {
				if (err) {
					return resolve(false);
				}

				return resolve(true);
			});
		});
	});
};

fsStore.prototype.deleteResource = function(type, id) {
	return this.getResource(type, id).then((resource) => {
		if (!resource) {
			return Promise.reject(new Error('Resource does not exist'));
		}

		return new Promise((resolve, reject) => {
			this.fs.unlink(this.path.join(this.dir, type, id), (err) => {
				if (err) {
					return resolve(false);
				}

				return resolve(true);
			});
		});
	});
};

module.exports = function(dir, fs, path) {
	if (!path) {
		path = require('path');
	}

	if (!dir) {
		dir = path.join(process.cwd(), '.store');
	}

	if (!fs) {
		fs = require('fs');
	}

	return new fsStore(dir, fs, path);
};