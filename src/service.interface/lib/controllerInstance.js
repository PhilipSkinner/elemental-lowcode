const controllerInstance = function(
    routeDefinition,
    path,
    clientConfig,
    passport,
    tagControllers,
    templateRenderer,
    fs,
    controllerState,
    roleCheckHandler
) {
    this.routeDefinition = routeDefinition;
    this.path = path;
    this.passport = passport;
    this.templateRenderer = templateRenderer;
    this.fs = fs;
    this.controllerState = controllerState;
    this.clientConfig = clientConfig;
    this.roleCheckHandler = roleCheckHandler;
    this.tagControllers = tagControllers;
};

controllerInstance.prototype.loadView = function() {
    return new Promise((resolve, reject) => {
        this.fs.readFile(this.path.join(process.env.DIR, this.routeDefinition.view), (err, content) => {
            if (err) {
                return reject(err);
            }

            let data = null;
            try {
                data = JSON.parse(content);
            } catch(e) {
                console.error(`Could not parse view ${this.routeDefinition.view} - ${e}`);
            }

            if (data === null) {
                return reject(new Error(`Cannot load view ${this.routeDefinition.view}`));
            }

            return resolve(data);
        });
    });
};

controllerInstance.prototype.handler = function(req, res, next) {
    const handleRequest = (req, res, next) => {
        //load our controller into its state machine
        let module = this.path.join(process.cwd(), process.env.DIR, this.routeDefinition.controller);
        delete require.cache[require.resolve(module)];
        let stateEngine = this.controllerState(require(module), this.clientConfig);
        stateEngine.setContext(req, res);

        let view = null;
        this.loadView().then((_view) => {
            view = _view;

            //we need to scan through the view to work out the tag controllers we need to instantiate
            let componentInstances = this.tagControllers.determineInstances(view);

            stateEngine.setComponents(componentInstances);
        }).then(() => {
            //ensure our state engine triggers on load
            if (req.method === 'POST') {
                let body = req.body;

                if (body.__params) {
                    body = JSON.parse(body.__params);
                }

                let event = {};
                if (req.files) {
                    Object.keys(req.files).forEach((path) => {
                        let parts = path.split('$$_$$');
                        let current = event;
                        for (var i = 0; i < parts.length; i++) {
                            if (i === parts.length - 1) {
                                current[parts[i]] = req.files[path];
                            } else {
                                if (!current[parts[i]]) {
                                    current[parts[i]] = {};
                                }

                                current = current[parts[i]];
                            }
                        }
                    });
                }

                //generate our post event!
                let eventName = 'postback';
                if (req.query && req.query._event) {
                    eventName = req.query._event;
                }

                Object.keys(body).forEach((valName) => {
                    //get the path version
                    var parts = valName.split('$$_$$');
                    let current = event;
                    for (var i = 0; i < parts.length; i++) {
                        if (i === parts.length - 1) {
                            current[parts[i]] = body[valName];
                        } else {
                            if (!current[parts[i]]) {
                                current[parts[i]] = {};
                            }

                            current = current[parts[i]];
                        }
                    }
                });

                return stateEngine.triggerEvent(eventName, this.ensureArrays(event));
            }

            if (req.method === 'GET') {
                //do we have an event to trigger?
                if (req.query.event) {
                    return stateEngine.triggerEvent(req.query.event, this.parseQuery(req.query));
                }
            }

            return Promise.resolve();
        }).then(() => {
            if (res.headersSent) {
                return Promise.resolve();
            }

            return stateEngine.triggerEvent('load', Object.assign(req.query, req.params));
        }).then(() => {
            stateEngine.generateResponseHeaders();

            // only render the view if we need to
            if ([301, 302].indexOf(res.statusCode) !== -1) {
                if (req.session && req.session.save) {
                    req.session.save(() => {
                        stateEngine = null;
                        res.end('');
                    });
                } else {
                    stateEngine = null;
                    res.end('');
                }

                return;
            }

            //load the view
            return this.templateRenderer.renderView(view, stateEngine.getBag()).then((html) => {
                res.send(html);

                //clear the stateEngine
                stateEngine = null;
            });
        }).catch((err) => {
            next(err);
        });
    };

    if (this.routeDefinition.secure && this.passport) {
        //reload the session first
        if (!(req.session && req.session.passport && req.session.passport.user && req.session.passport.user.accessToken)) {
            return this.passport.authenticate('oauth2')(req, res, next);
        } else if (this.routeDefinition.roles) {
            return this.roleCheckHandler.enforceRoles(handleRequest.bind(this), this.routeDefinition.roles.split(','))(req, res, next);
        }
    }

    return handleRequest(req, res, next);
};

controllerInstance.prototype.parseQuery = function(obj) {
    const ret = {};

    Object.keys(obj).forEach((key) => {
        let parts = key.split('__');

        let current = ret;
        parts.forEach((p, index) => {
            if (index + 1 === parts.length) {
                current[p] = obj[key];
            } else {
                let isArray = (parseInt(parts[index + 1]) + '') === parts[index + 1];

                if (isArray) {
                    current[p] = current[p] || [];
                } else {
                    current[p] = current[p] || {};
                }

                current = current[p];
            }
        });

        //get the path version
        parts = key.split('$$_$$');
        for (var i = 0; i < parts.length; i++) {
            if (i === parts.length - 1) {
                current[parts[i]] = obj[key];
            } else {
                if (!current[parts[i]]) {
                    current[parts[i]] = {};
                }

                current = current[parts[i]];
            }
        }
    });

    return ret;
};

controllerInstance.prototype.ensureArrays = function(obj) {
    let allNums = true;
    Object.keys(obj).forEach((k) => {
        if (parseInt(k) != k) {
            allNums = false;
        }

        if (typeof(obj[k]) === 'object') {
            obj[k] = this.ensureArrays(obj[k]);
        }
    });

    if (allNums) {
        let ret = [];
        Object.keys(obj).forEach((k) => {
            ret[parseInt(k)] = obj[k];
        });
        return ret;
    }

    return obj;
};

module.exports = function(
    routeDefinition,
    templateRenderer,
    clientConfig,
    passport,
    tagControllers,
    path,
    fs,
    controllerState,
    roleCheckHandler
) {
    if (!path) {
        path = require('path');
    }

    if (!fs) {
        fs = require('fs');
    }

    if (!controllerState) {
        controllerState = require('./controllerState');
    }

    if (!roleCheckHandler) {
        roleCheckHandler = require('../../support.lib/roleCheckHandler')();
    }

    return new controllerInstance(routeDefinition, path, clientConfig, passport, tagControllers, templateRenderer, fs, controllerState, roleCheckHandler);
};