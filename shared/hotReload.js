const hotReload = function(chokidar) {
	this.chokidar = chokidar;
};

hotReload.prototype.watch = function(dir, cb) {
	this.chokidar.watch(dir).on('all', () => {
		cb();
	});
};

module.exports = function(chokidar) {
	if (!chokidar) {
		chokidar = require('chokidar');
	}

	return new hotReload(chokidar);
};