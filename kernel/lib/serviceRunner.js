const serviceRunner = function(childProcess) {
	this.childProcess = childProcess;
};

serviceRunner.prototype.runService = function(name, script, port, dir) {	
	const proc = this.childProcess.spawn('node.exe', [
		script
	], {
		cwd 	: process.cwd(),
		env 	: Object.assign(process.env, {
			PORT 	: port,
			DIR 	: dir
		})
	});

	proc.on('error', (data) => {
		console.log(data);
	});

	proc.stdout.on('data', (data) => {
		const lines = data.toString('utf8').split('\n');

		lines.forEach((l) => {
			if (l !== "") {
				console.log(name, "STDOUT", l);	
			}			
		});
	});

	proc.stderr.on('data', (data) => {
		const lines = data.toString('utf8').split('\n');

		lines.forEach((l) => {
			if (l !== "") {
				console.error(name, "STDERR", l);				
			}
		});
	});

	proc.on('close', (code) => {
		console.error(name, "CLOSE", "SERVICE HAS CLOSED!");
	});
};

module.exports = function(childProcess) {
	if (!childProcess) {
		childProcess = require('child_process');
	}

	return new serviceRunner(childProcess);
};