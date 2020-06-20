const serviceRunner = function(childProcess, logger) {
	this.childProcess = childProcess;
	this.logger = logger;

	this.nodeProcess = "node";

	if (process.platform === "win32") {
		this.nodeProcess = "node.exe";
	}

	this.processes = {};
};

serviceRunner.prototype.stopService = function(name) {
	this.processes[name].kill();
};

serviceRunner.prototype.runService = function(name, script, port, dir, other) {
	if (this.processes[name]) {
		this.stopService(name);
	}

	this.logger.logStartup(name);

	this.processes[name] = this.childProcess.spawn(this.nodeProcess, [
		script
	], {
		cwd 	: process.cwd(),
		env 	: Object.assign(Object.assign(process.env, {
			PORT 	: port,
			DIR 	: dir
		}), other || {})
	});

	this.processes[name].on("error", (data) => {
		const lines = data.toString("utf8").split("\n");
		this.logger.error(name, lines);
	});

	this.processes[name].stdout.on("data", (data) => {
		const lines = data.toString("utf8").split("\n");

		lines.forEach((l) => {
			if (l !== "") {
				this.logger.log(name, l);
			}
		});
	});

	this.processes[name].stderr.on("data", (data) => {
		const lines = data.toString("utf8").split("\n");

		lines.forEach((l) => {
			if (l !== "") {
				this.logger.error(name, l);
			}
		});
	});

	this.processes[name].on("close", (code) => {
		this.logger.error(name, "SERVICE HAS CLOSED!");
	});
};

module.exports = function(childProcess, logger) {
	if (!childProcess) {
		childProcess = require("child_process");
	}

	if (!logger) {
		logger = require("../../shared/logger");
	}

	return new serviceRunner(childProcess, logger);
};