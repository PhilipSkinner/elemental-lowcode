const fileLister = function(path, fs, glob, mkdirp, tar) {
	this.path = path;
	this.fs = fs;
	this.glob = glob;
	this.mkdirp = mkdirp;
	this.tar = tar;
};

fileLister.prototype.extractTar = function(dir, buffer) {
	let name = Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 5);
	return this.writeFile(process.cwd(), `${name}.tar`, buffer).then(() => {
		return this.ensureDir(dir);
	}).then(() => {
		return this.tar.x({
			file : this.path.join(process.cwd(), `${name}.tar`),
			cwd : this.path.join(process.cwd(), dir)
		});
	}).then(() => {
		return this.deleteFile(process.cwd(), `${name}.tar`);
	})
};

fileLister.prototype.tarDir = function(dir) {
	let name = Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 5);
	let data = null;

	return this.ensureDir(dir).then(() => {
		return this.tar.c({
			gzip : false,
			file : `${name}.tar`,
			cwd : this.path.join(process.cwd(), dir)
		}, [
			"."
		]);
	}).then(() => {
		// read the tarball and return it
		return this.readFile(process.cwd(), `${name}.tar`, true);
	}).then((buffer) => {
		data = buffer;
		return this.deleteFile(process.cwd(), `${name}.tar`);
	}).then(() => {
		return Promise.resolve(data);
	})
};

fileLister.prototype.executeGlob = function(lookup) {
	return new Promise((resolve, reject) => {
		this.glob(lookup, (err, results) => {
			if (err) {
				return reject(err);
			}

			return resolve(results.map((f) => {
				return {
					path 		: f,
					basename 	: this.path.basename(f),
					name 		: this.path.basename(f).split(".").slice(0, -1).join(".")
				}
			}));
		});
	});
};

fileLister.prototype.readFile = function(dir, file, binary) {
	return new Promise((resolve, reject) => {
		this.ensureDir(dir).then(() => {
			this.fs.readFile(this.path.join(dir, file), (err, content) => {
				if (err) {
					return reject(err);
				}

				if (binary) {
					return resolve(content);
				}

				return resolve(content.toString("utf8"));
			});
		});
	});
};

fileLister.prototype.readJSONFile = function(dir, file) {
	return new Promise((resolve, reject) => {
		this.ensureDir(dir).then(() => {
			this.fs.readFile(this.path.join(dir, file), (err, content) => {
				if (err) {
					return reject(err);
				}

				let data = null;
				try {
					data = JSON.parse(content);
				} catch(e) {
					console.error(`Failed to parse file ${file} in ${dir}`);
				}

				if (data === null) {
					return reject(new Error(`Cannot parse file ${file} in ${dir}`));
				}

				return resolve(data);
			});
		});
	});
};

fileLister.prototype.ensureDir = function(dir) {
	return this.mkdirp(dir);
};

fileLister.prototype.writeFile = function(dir, file, contents) {
	return new Promise((resolve, reject) => {
		this.ensureDir(dir).then(() => {
			this.fs.writeFile(this.path.join(dir, file), contents, (err) => {
				if (err) {
					return reject(err);
				}

				return resolve();
			});
		});
	});
};

fileLister.prototype.deleteFile = function(dir, file) {
	return new Promise((resolve, reject) => {
		this.ensureDir(dir).then(() => {
			this.fs.unlink(this.path.join(dir, file), (err) => {
				if (err) {
					return reject(err);
				}

				return resolve();
			});
		});
	});
};

module.exports = function(path, fs, glob, mkdirp, tar) {
	if (!path) {
		path = require("path");
	}

	if (!fs) {
		fs = require("fs");
	}

	if (!glob) {
		glob = require("glob");
	}

	if (!mkdirp) {
		mkdirp = require("mkdirp");
	}

	if (!tar) {
		tar = require('tar');
	}

	return new fileLister(path, fs, glob, mkdirp, tar);
};