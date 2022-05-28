const serviceRunner = function(childProcess, logger, path) {
    this.childProcess = childProcess;
    this.logger = logger;
    this.path = path;

    this.nodeProcess = "./node_modules/.bin/nodemon";

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
        "--watch",
        this.path.dirname(script),
        "--watch",
        this.path.join(this.path.dirname(script), "../support.lib"),
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

    this.processes[name].on("close", () => {
        this.logger.error(name, "SERVICE HAS CLOSED!");
    });
};

module.exports = function(childProcess, logger, path) {
    if (!childProcess) {
        childProcess = require("child_process");
    }

    if (!logger) {
        logger = require("../../support.lib/logger")();
    }

    if (!path) {
        path = require("path");
    }

    return new serviceRunner(childProcess, logger, path);
};