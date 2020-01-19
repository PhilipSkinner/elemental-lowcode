const fileLister = function(path, fs, glob) {
	this.path = path;
	this.fs = fs;
	this.glob = glob;
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
					name 		: this.path.basename(f).split('.').slice(0, -1).join('.')
				}
			}));
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

module.exports = function(path, fs, glob) {
	if (!path) {
		path = require('path');
	}

	if (!fs) {
		fs = require('fs');
	}

	if (!glob) {
		glob = require('glob');
	}

	return new fileLister(path, fs, glob);
};