const fileLister = function(path, fs, glob, mkdirp) {
	this.path = path;
	this.fs = fs;
	this.glob = glob;
	this.mkdirp = mkdirp;
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

fileLister.prototype.readFile = function(dir, file) {
	return new Promise((resolve, reject) => {
		this.fs.readFile(this.path.join(dir, file), (err, content) => {
			if (err) {
				return reject(err);
			}

			return resolve(content.toString("utf8"));
		});
	});
};

fileLister.prototype.readJSONFile = function(dir, file) {
	return new Promise((resolve, reject) => {
		this.fs.readFile(this.path.join(dir, file), (err, content) => {
			if (err) {
				return reject(err);
			}

			let data = null;
			try {
				data = JSON.parse(content);
			} catch(e) {}

			if (data == null) {
				return reject(new Error(`Cannot parse file ${file} in ${dir}`));
			}

			return resolve(data);
		});
	});
};

fileLister.prototype.ensureDir = function(dir) {
	return this.mkdirp(dir);
}

fileLister.prototype.writeFile = function(dir, file, contents) {
	return new Promise((resolve, reject) => {
		this.fs.writeFile(this.path.join(dir, file), contents, (err) => {
			if (err) {
				return reject(err);
			}

			return resolve();
		});
	});
};

fileLister.prototype.deleteFile = function(dir, file) {
	return new Promise((resolve, reject) => {
		this.fs.unlink(this.path.join(dir, file), (err) => {
			if (err) {
				return reject(err);
			}

			return resolve();
		});
	});
};

module.exports = function(path, fs, glob, mkdirp) {
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
		mkdirp = require("mkdirp")
	}

	return new fileLister(path, fs, glob, mkdirp);
};