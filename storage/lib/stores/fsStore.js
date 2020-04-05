const fsStore = function(dir, fs, path, jsonpath) {
	this.dir 		= dir;
	this.fs 		= fs;
	this.path 		= path;
	this.jsonpath 	= jsonpath;
};

fsStore.prototype.ensureDir = function(dir) {
	return new Promise((resolve, reject) => {
		this.fs.stat(dir, (err) => {
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

fsStore.prototype.applyFilters = function(dir, filters, type) {
	return new Promise((resolve, reject) => {
		return Promise.all(dir.map((s) => {
			return this.getResource(type, s).then((resource) => {
				let found = true;
				filters.forEach((f) => {
					let value = this.jsonpath.query(resource, f.path);
					if (value != f.value) {
						found = false;
					}
				});

				if (found) {
					return Promise.resolve(resource);
				}

				return Promise.resolve(null);
			});
		})).then((filtered) => {
			return resolve(filtered.reduce((sum, a) => {
				if (a !== null) {
					sum.push(a);
				}
				return sum;
			}, []));
		});
	});
};

fsStore.prototype.getResources = function(type, start, count, filters) {
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

				//apply our filters
				if (filters && filters.length > 0) {
					return this.applyFilters(dir, filters, type).then((dir) => { return resolve(dir) });
				}

				return resolve(dir);
			});
		});
	}).then((dir) => {
		let selection = dir.slice(start - 1, count);

		return Promise.all(selection.map((s) => {
			if (typeof(s) === "object") {
				return Promise.resolve(s);
			}
			return this.getResource(type, s);
		}));
	});
};

fsStore.prototype.getResource = function(type, id) {
	return this.initType(type).then(() => {
		return new Promise((resolve, reject) => {
			this.fs.readFile(this.path.join(this.dir, type, id), (err, content) => {
				if (err) {
					return resolve(null);
				}

				let object = null;
				try {
					object = JSON.parse(content.toString("utf8"));
					object.id = id;
				} catch(e) {
					return reject(new Error(`Could not parse resource ${type}:${id}`));
				}
				
				return resolve(object);
			});
		});
	});
};

fsStore.prototype.createResource = function(type, id, data) {
	return this.getResource(type, id).then((resource) => {
		if (resource) {
			return Promise.reject(new Error("Resource already exists"));
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
			return Promise.reject(new Error("Resource does not exist"));
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
			return Promise.reject(new Error("Resource does not exist"));
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

module.exports = function(dir, fs, path, jsonpath) {
	if (!path) {
		path = require("path");
	}

	if (!dir) {
		dir = path.join(process.cwd(), ".store");
	}

	if (!fs) {
		fs = require("fs");
	}

	if (!jsonpath) {
		jsonpath = require('jsonpath');
	}

	return new fsStore(dir, fs, path, jsonpath);
};