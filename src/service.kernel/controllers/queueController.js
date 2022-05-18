const queueController = function(app, dir, fileLister, roleCheckHandler, path) {
    this.app 				= app;
    this.dir 				= dir;
    this.path 				= path;
    this.fileLister 		= fileLister;
    this.roleCheckHandler 	= roleCheckHandler;

    this.initEndpoints();
};

queueController.prototype.get = function(req, res) {
    this.fileLister.executeGlob(this.path.join(this.dir, '*.queue.json')).then((results) => {
        res.status(200);
        res.json(results.map((r) => {
            r.name = r.name.slice(0, -6);
            return r;
        }));
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

queueController.prototype.getSingular = function(req, res) {
    this.fileLister.readJSONFile(this.dir, req.params.name + '.queue.json').then((content) => {
        res.status(200);
        res.json(content);
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

queueController.prototype.update = function(req, res) {
    this.fileLister.writeFile(this.dir, req.params.name + '.queue.json', JSON.stringify(req.body)).then(() => {
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

queueController.prototype.delete = function(req, res) {
    this.fileLister.deleteFile(this.dir, req.params.name + '.queue.json').then(() => {
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

queueController.prototype.create = function(req, res) {
    this.fileLister.writeFile(this.dir, req.body.name + '.queue.json', JSON.stringify(req.body)).then(() => {
        res.status(201);
        res.location('/queues/' + req.body.name);
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

queueController.prototype.getHandler = function(req, res) {
    this.fileLister.readFile(this.dir, req.params.name + '.queue.js').then((content) => {
        res.status(200);
        res.send(content);
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

queueController.prototype.setHandler = function(req, res) {
    this.fileLister.writeFile(this.dir, req.params.name + '.queue.js', req.body.payload).then(() => {
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

queueController.prototype.initEndpoints = function() {
    if (!this.app) {
        return;
    }

    this.app.get('/queues', 				this.roleCheckHandler.enforceRoles(this.get.bind(this), 				['queue_reader', 'queue_admin', 'system_reader', 'system_admin']));
    this.app.get('/queues/:name', 			this.roleCheckHandler.enforceRoles(this.getSingular.bind(this), 		['queue_reader', 'queue_admin', 'system_reader', 'system_admin']));
    this.app.put('/queues/:name', 			this.roleCheckHandler.enforceRoles(this.update.bind(this), 				['queue_writer', 'queue_admin', 'system_writer', 'system_admin']));
    this.app.delete('/queues/:name', 		this.roleCheckHandler.enforceRoles(this.delete.bind(this), 				['queue_writer', 'queue_admin', 'system_writer', 'system_admin']));
    this.app.post('/queues', 				this.roleCheckHandler.enforceRoles(this.create.bind(this), 				['queue_writer', 'queue_admin', 'system_writer', 'system_admin']));
    this.app.get('/queues/:name/handler', 	this.roleCheckHandler.enforceRoles(this.getHandler.bind(this), 			['queue_reader', 'queue_admin', 'system_reader', 'system_admin']));
    this.app.put('/queues/:name/handler', 	this.roleCheckHandler.enforceRoles(this.setHandler.bind(this), 			['queue_writer', 'queue_admin', 'system_writer', 'system_admin']));
};

module.exports = function(app, dir, fileLister, path, roleCheckHandler) {
    if (!fileLister) {
        fileLister = require('../lib/fileLister')();
    }

    if (!path) {
        path = require('path');
    }

    if (!roleCheckHandler) {
        roleCheckHandler = require('../../support.lib/roleCheckHandler')();
    }

    return new queueController(app, dir, fileLister, roleCheckHandler, path);
};