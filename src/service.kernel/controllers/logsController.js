const logsController = function(app, dir, roleCheckHandler, readLastLines, path) {
    this.app 				= app;
    this.dir 				= dir;
    this.roleCheckHandler 	= roleCheckHandler;
    this.readLastLines 		= readLastLines;
    this.path 				= path;

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

logsController.prototype.initEndpoints = function() {
    if (!this.app) {
        return;
    }

    this.app.get('/logs/:service', 			this.roleCheckHandler.enforceRoles(this.get.bind(this), 		['system_reader', 'system_admin']));
};

module.exports = function(app, dir, roleCheckHandler, readLastLines, path) {
    if (!roleCheckHandler) {
        roleCheckHandler = require('../../support.lib/roleCheckHandler')();
    }

    if (!readLastLines) {
        readLastLines = require('../lib/readLastLines')();
    }

    if (!path) {
        path = require('path');
    }

    return new logsController(app, dir, roleCheckHandler, readLastLines, path);
};