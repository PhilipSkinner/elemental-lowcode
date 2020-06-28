const hotReload = function(chokidar) {
	this.chokidar = chokidar;
};

hotReload.prototype.attemptLaunch = function(cb, onFail) {
	try {
		cb();
	} catch(err) {
		console.error(err);
		this.pauseBeforeAttempt(cb, onFail, err);
	}
};

hotReload.prototype.pauseBeforeAttempt = function(cb, onFail, err) {
	console.error("Issue with starting service, attempting to restart in 500ms...");
	setTimeout(() => {
		onFail();
		this.attemptLaunch(cb);
	}, 500);
};

hotReload.prototype.watch = function(dir, cb, onFail) {
	//setup our unhandled rejection handler
	process.on('unhandledRejection', (err) => {
		console.error(err);
		this.pauseBeforeAttempt(cb, onFail, err);
	});

	this.chokidar.watch(dir).on("all", () => {
		this.attemptLaunch(cb, onFail);
	});
};

module.exports = function(chokidar) {
	if (!chokidar) {
		chokidar = require("chokidar");
	}

	return new hotReload(chokidar);
};