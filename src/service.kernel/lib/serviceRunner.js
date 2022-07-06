const processes = {};

const serviceRunner = function(childProcess, logger, path, pidusage) {
    this.childProcess = childProcess;
    this.logger = logger;
    this.path = path;
    this.pidusage = pidusage;

    this.nodeProcess = "./node_modules/.bin/nodemon";

    if (process.platform === "win32") {
        this.nodeProcess = "node.exe";
    }
};

serviceRunner.prototype.listServices = function() {
    return Promise.all(Object.keys(processes).map((name) => {
        return this.pidusage(processes[name].pid).then((stats) => {
            let cpu = 0;
            let memory = 0;
            let pids = [];
            let uptime = null;

            Object.keys(stats).forEach((pid) => {
                pids.push(pid);
                cpu += stats[pid].cpu;
                memory += stats[pid].memory;

                if (uptime === null || stats[pid].elapsed < uptime) {
                    uptime = stats[pid].elapsed;
                }
            });

            return {
                name    : name,
                pids    : pids,
                uptime  : uptime / 1000,
                cpu     : cpu,
                memory  : memory,
            };
        });
    }));
};

serviceRunner.prototype._resetProcesses = function() {
    Object.keys(processes).forEach((key) => {
        delete(processes[key]);
    });
};

serviceRunner.prototype._insertProcess = function(name, proc) {
    processes[name] = proc;
};

serviceRunner.prototype.stopService = function(name) {
    processes[name].kill();
};

serviceRunner.prototype.runService = function(name, script, port, dir, other) {
    if (processes[name]) {
        this.stopService(name);
    }

    this.logger.logStartup(name);

    processes[name] = this.childProcess.spawn(this.nodeProcess, [
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

    processes[name].on("error", (data) => {
        const lines = data.toString("utf8").split("\n");
        this.logger.error(name, lines);
    });

    processes[name].stdout.on("data", (data) => {
        const lines = data.toString("utf8").split("\n");

        lines.forEach((l) => {
            if (l !== "") {
                this.logger.log(name, l);
            }
        });
    });

    processes[name].stderr.on("data", (data) => {
        const lines = data.toString("utf8").split("\n");

        lines.forEach((l) => {
            if (l !== "") {
                this.logger.error(name, l);
            }
        });
    });

    processes[name].on("close", () => {
        this.logger.error(name, "SERVICE HAS CLOSED!");
    });
};

module.exports = function(childProcess, logger, path, pidusage) {
    if (!childProcess) {
        childProcess = require("child_process");
    }

    if (!logger) {
        logger = require("../../support.lib/logger")();
    }

    if (!path) {
        path = require("path");
    }

    if (!pidusage) {
        pidusage = require("pidusage-tree");
    }

    return new serviceRunner(childProcess, logger, path, pidusage);
};