const setup = function(mkdirp) {
	this.mkdirp = mkdirp;
};

setup.prototype.ensureDir = function(dir) {
	return this.mkdirp(dir);
};

setup.prototype.setupEnvironment = function(directories) {
	return Promise.all(Object.keys(directories).map((d) => {
		return this.ensureDir(directories[d]);
	}));
};

module.exports = function(mkdirp) {
	if (!mkdirp) {
		mkdirp = require('mkdirp');
	}

	return new setup(mkdirp);
};