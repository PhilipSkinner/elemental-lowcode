const logsController = function(app, dir, roleCheckHandler, readLastLines, path, serviceRunner) {
    this.app 				= app;
    this.dir 				= dir;
    this.roleCheckHandler 	= roleCheckHandler;
    this.readLastLines 		= readLastLines;
    this.path 				= path;
    this.serviceRunner      = serviceRunner;

    this.initEndpoints();
};

logsController.prototype.get = function(req, res) {
    const system = req.params.service;
    const from = req.query.from || 0;

    this.readLastLines.read(this.path.join(__dirname, `../logs/${system}.log`), from).then((lines) => {
        res.status(200);
        res.json({
            lines : lines
        });
        res.end();
    }).catch(() => {
        res.status(200);
        res.json({});
        res.end();
    });
};

logsController.prototype.status = function(req, res) {
    this.serviceRunner.listServices().then((services) => {
        res.status(200);
        res.json({
            services : services
        });
        res.end();
    }).catch((err) => {
        res.status(500);
        res.json({
            errors : [
                err.toString()
            ]
        });
        res.end();
    });
};

logsController.prototype.initEndpoints = function() {
    if (!this.app) {
        return;
    }

    this.app.get("/logs/:service", 			this.roleCheckHandler.enforceRoles(this.get.bind(this), 		["system_reader", "system_admin"]));
    this.app.get("/status",                 this.roleCheckHandler.enforceRoles(this.status.bind(this),      ["system_reader", "system_admin"]));
};

module.exports = function(app, dir, roleCheckHandler, readLastLines, path, serviceRunner) {
    if (!roleCheckHandler) {
        roleCheckHandler = require("../../support.lib/roleCheckHandler")();
    }

    if (!readLastLines) {
        readLastLines = require("../lib/readLastLines")();
    }

    if (!path) {
        path = require("path");
    }

    if (!serviceRunner) {
        serviceRunner = require("../lib/serviceRunner")();
    }

    return new logsController(app, dir, roleCheckHandler, readLastLines, path, serviceRunner);
};