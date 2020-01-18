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

			return resolve(results);
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