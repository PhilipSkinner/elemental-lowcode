const indexController = function(app, dir, fileLister, roleCheckHandler) {
    this.app = app;
    this.dir = dir;
    this.fileLister = fileLister;
    this.roleCheckHandler = roleCheckHandler;

    this.initEndpoints();
};

indexController.prototype.get = function(req, res) {
    this.fileLister.tarDir(this.dir).then((buffer) => {
        res.status(200);
        res.send(buffer);
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

indexController.prototype.post = function(req, res) {
    this.fileLister.extractTar(this.dir, Buffer.from(req.body.file, 'base64')).then(() => {
        res.status(204);
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

indexController.prototype.initEndpoints = function() {
    if (!this.app) {
        return;
    }

    this.app.get('/', 			this.roleCheckHandler.enforceRoles(this.get.bind(this), 		['system_reader', 'system_admin']));
    this.app.post('/', 			this.roleCheckHandler.enforceRoles(this.post.bind(this), 		['system_writer', 'system_admin']));
};

module.exports = function(app, dir, fileLister, roleCheckHandler) {
    if (!fileLister) {
        fileLister = require('../lib/fileLister')();
    }

    if (!roleCheckHandler) {
        roleCheckHandler = require('../../support.lib/roleCheckHandler')();
    }

    return new indexController(app, dir, fileLister, roleCheckHandler);
};