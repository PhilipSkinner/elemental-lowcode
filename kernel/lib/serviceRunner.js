const serviceRunner = function(childProcess) {
	this.childProcess = childProcess;

	this.nodeProcess = "node";

	if (process.platform === "win32") {
		this.nodeProcess = "node.exe";
	}
};

serviceRunner.prototype.runService = function(name, script, port, dir, other) {	
	const proc = this.childProcess.spawn(this.nodeProcess, [
		script
	], {
		cwd 	: process.cwd(),
		env 	: Object.assign(Object.assign(process.env, {
			PORT 	: port,
			DIR 	: dir
		}), other || {})
	});

	proc.on("error", (data) => {
		console.log(data);
	});

	proc.stdout.on("data", (data) => {
		const lines = data.toString("utf8").split("\n");

		lines.forEach((l) => {
			if (l !== "") {
				console.log(name, "STDOUT", l);	
			}			
		});
	});

	proc.stderr.on("data", (data) => {
		const lines = data.toString("utf8").split("\n");

		lines.forEach((l) => {
			if (l !== "") {
				console.error(name, "STDERR", l);				
			}
		});
	});

	proc.on("close", (code) => {
		console.error(name, "CLOSE", "SERVICE HAS CLOSED!");
	});
};

module.exports = function(childProcess) {
	if (!childProcess) {
		childProcess = require("child_process");
	}

	return new serviceRunner(childProcess);
};