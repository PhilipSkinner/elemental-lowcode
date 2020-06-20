const serviceRunner = function(childProcess) {
	this.childProcess = childProcess;

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
		console.log(data);
	});

	this.processes[name].stdout.on("data", (data) => {
		const lines = data.toString("utf8").split("\n");

		lines.forEach((l) => {
			if (l !== "") {
				console.log(name, "STDOUT", l);
			}
		});
	});

	this.processes[name].stderr.on("data", (data) => {
		const lines = data.toString("utf8").split("\n");

		lines.forEach((l) => {
			if (l !== "") {
				console.error(name, "STDERR", l);
			}
		});
	});

	this.processes[name].on("close", (code) => {
		console.error(name, "CLOSE", "SERVICE HAS CLOSED!");
	});
};

module.exports = function(childProcess) {
	if (!childProcess) {
		childProcess = require("child_process");
	}

	return new serviceRunner(childProcess);
};