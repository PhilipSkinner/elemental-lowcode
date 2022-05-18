const integrationsController = function(app, dir, fileLister, roleCheckHandler, path, typeValidator) {
    this.app 				= app;
    this.dir 				= dir;
    this.path 				= path;
    this.fileLister 		= fileLister;
    this.roleCheckHandler 	= roleCheckHandler;
    this.typeValidator		= typeValidator;

    this.initEndpoints();
};

integrationsController.prototype.get = function(req, res) {
    this.fileLister.executeGlob(this.path.join(this.dir, '**/*.json')).then((results) => {
        res.status(200);
        res.json(results.map((r) => {
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

integrationsController.prototype.getSingular = function(req, res) {
    this.fileLister.readJSONFile(this.dir, req.params.name + '.json').then((content) => {
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

integrationsController.prototype.update = function(req, res) {
    //validate the JSON
    this.typeValidator.validate('integration', req.body).then(() => {
        return this.fileLister.writeFile(this.dir, req.params.name + '.json', JSON.stringify(req.body));
    }).then(() => {
        res.status(204);
        res.end();
    }).catch((err) => {
        if (Array.isArray(err)) {
            res.status(422);
            res.json({
                errors : err
            });
        } else {
            res.status(500);
            res.json({
                errors : [
                    err.toString()
                ]
            });
        }

        res.end();
    });
};

integrationsController.prototype.delete = function(req, res) {
    this.fileLister.deleteFile(this.dir, req.params.name + '.json').then(() => {
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

integrationsController.prototype.create = function(req, res) {
    this.typeValidator.validate('integration', req.body).then(() => {
        return this.fileLister.writeFile(this.dir, req.body.name + '.json', JSON.stringify(req.body));
    }).then(() => {
        res.status(201);
        res.location('/integrations/' + req.body.name);
        res.end();
    }).catch((err) => {
        if (Array.isArray(err)) {
            res.status(422);
            res.json({
                errors : err
            });
        } else {
            res.status(500);
            res.json({
                errors : [
                    err.toString()
                ]
            });
        }

        res.end();
    });
};

integrationsController.prototype.initEndpoints = function() {
    if (!this.app) {
        return;
    }

    this.app.get('/integrations', 			this.roleCheckHandler.enforceRoles(this.get.bind(this), 		['integration_reader', 'integration_admin', 'system_reader', 'system_admin']));
    this.app.get('/integrations/:name', 	this.roleCheckHandler.enforceRoles(this.getSingular.bind(this), ['integration_reader', 'integration_admin', 'system_reader', 'system_admin']));
    this.app.put('/integrations/:name', 	this.roleCheckHandler.enforceRoles(this.update.bind(this), 		['integration_writer', 'integration_admin', 'system_writer', 'system_admin']));
    this.app.delete('/integrations/:name', 	this.roleCheckHandler.enforceRoles(this.delete.bind(this), 		['integration_writer', 'integration_admin', 'system_writer', 'system_admin']));
    this.app.post('/integrations', 			this.roleCheckHandler.enforceRoles(this.create.bind(this), 		['integration_writer', 'integration_admin', 'system_writer', 'system_admin']));
};

module.exports = function(app, dir, fileLister, path, roleCheckHandler, typeValidator) {
    if (!fileLister) {
        fileLister = require('../lib/fileLister')();
    }

    if (!path) {
        path = require('path');
    }

    if (!roleCheckHandler) {
        roleCheckHandler = require('../../support.lib/roleCheckHandler')();
    }

    if (!typeValidator) {
        typeValidator = require('../lib/typeValidator')();
    }

    return new integrationsController(app, dir, fileLister, roleCheckHandler, path, typeValidator);
};