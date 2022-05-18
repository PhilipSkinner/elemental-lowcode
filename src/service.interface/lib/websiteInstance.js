const websiteInstance = function(
    app,
    definition,
    controllerInstance,
    templateRenderer,
    express,
    path,
    hostnameResolver,
    dataResolver,
    environmentService,
    sqlSessionStore,
    tagControllers
) {
    this.app 					= app;
    this.definition 			= definition;
    this.controllerInstance 	= controllerInstance;
    this.templateRenderer 		= templateRenderer;
    this.express 				= express;
    this.path 					= path;
    this.hostnameResolver 		= hostnameResolver;
    this.dataResolver 			= dataResolver;
    this.environmentService 	= environmentService;
    this.sqlSessionStore 		= sqlSessionStore;
    this.tagControllers 		= tagControllers;
};

websiteInstance.prototype.configureErrorHandler = function(passport) {
    //generate our instances
    const instances = {
        '400' : null,
        '401' : null,
        '402' : null,
        '403' : null,
        '404' : null,
        '405' : null,
        '406' : null,
        '408' : null,
        '409' : null,
        '411' : null,
        '412' : null,
        '413' : null,
        '414' : null,
        '415' : null,
        '417' : null,
        '422' : null,
        '429' : null,
        '431' : null,
        '500' : null,
        '501' : null,
        '505' : null,
    };

    if (this.definition.errorHandlers) {
        Object.keys(this.definition.errorHandlers).forEach((handlerName) => {
            const handler = this.definition.errorHandlers[handlerName];

            if (handler && handler.handles && handler.handles.length > 0) {
                let instance = null;
                handler.handles.forEach((code) => {
                    if (instances[code + ''] === null) {
                        if (instance === null) {
                            instance = this.controllerInstance(handler, this.templateRenderer, this.definition.client, passport, this.tagControllers);
                        }

                        instances[code + ''] = instance;
                    }
                });
            }
        });
    }

    this.app.use(`/${this.definition.name}*`, (req, res, next) => {
        if (res.headersSent) {
            return next();
        }

        if (res.statusCode === 200 && instances['404'] !== null) {
            res.statusCode = 404;
            return instances['404'].handler(req, res, next);
        }

        next();
    });

    this.app.use(`/${this.definition.name}*`, (err, req, res, next) => {
        let errorCode = 500;

        if (err) {
            if (err.status) {
                errorCode = err.status;
            }

            if (err.statusCode) {
                errorCode = err.statusCode;
            }
        }

        if (instances[errorCode + ''] !== null) {
            res.statusCode = errorCode;
            req.params.error = err;
            return instances[errorCode + ''].handler(req, res, next);
        }

        next(err);
    });
};

websiteInstance.prototype.configureTag = function(tag) {
    this.tagControllers.registerController(tag.name, tag.controller, tag.raw);
    this.templateRenderer.registerCustomTag(tag);
};

websiteInstance.prototype.configureStatic = function() {
    this.app.use(
        `/${this.definition.name}/static`,
        this.express.static(this.path.join(process.cwd(), process.env.DIR, `${this.definition.name}-static`))
    );
};

websiteInstance.prototype.configureRoute = function(route, passport) {
    let instance = this.controllerInstance(this.definition.routes[route], this.templateRenderer, this.definition.client, passport, this.tagControllers);

    console.log(`Hosting ${route} on ${this.definition.name} - /${this.definition.name}${route}`);
    this.app.get(`/${this.definition.name}${route}`, instance.handler.bind(instance));
    this.app.post(`/${this.definition.name}${route}`, instance.handler.bind(instance));
};

websiteInstance.prototype.init = function() {
    return new Promise((resolve) => {
        //setup our static hosting
        this.configureStatic();

        //setup our shared tags
        this.definition.tagsets.forEach((t) => {
            this.configureTag({
                name 		: t.tag,
                controller 	: t.controller,
                view 		: t.view,
                raw 		: true
            });
        });

        //setup our custom tags
        this.definition.tags.forEach((t) => {
            this.configureTag(t);
        });

        let passport = null;
        //setup our security if we have a client defined
        if (typeof(this.definition.client) !== 'undefined' && this.definition.client !== null) {
            delete require.cache[require.resolve('passport')];
            const oidc = require('passport-oauth2');
            passport = require('passport');
            passport.use(new oidc({
                authorizationURL 	: `${this.hostnameResolver.resolveIdentity()}/auth`,
                tokenURL 			: `${this.hostnameResolver.resolveIdentity()}/token`,
                clientID			: this.definition.client.client_id,
                clientSecret 		: this.definition.client.client_secret,
                callbackURL 		: `${this.hostnameResolver.resolveInterface()}/${this.definition.name}/_auth`,
                scope 				: this.definition.client.scope,
                passReqToCallback	: true,
            }, (req, accessToken, refreshToken, params, profile, done) => {
                done(null, {
                    idToken 		: params.id_token,
                    accessToken 	: accessToken,
                    refreshToken 	: params.refresh_token
                });
            }));

            passport.serializeUser(function(user, done) {
                done(null, user);
            });

            passport.deserializeUser(function(user, done) {
                done(null, user);
            });

            const session = require('express-session');

            //setup our authentication
            this.app.use(session({
                name 				: `session.${this.definition.name}`,
                path 				: `/${this.definition.name}`,
                secret 				: this.definition.name,
                resave 			  	: false,
                saveUninitialized 	: false,
                store 				: this.sqlSessionStore(session, process.env.MYSQL_CONNECTION_STRING, this.definition.name),
            }));
            this.app.use(`/${this.definition.name}`, passport.initialize());
            this.app.use(`/${this.definition.name}`, passport.session());
            this.app.use(`/${this.definition.name}/_auth`, passport.authenticate('oauth2', {
                failureRedirect : `/${this.definition.name}/error`,
                successRedirect : `/${this.definition.name}`
            }));
        }

        //setup our routes
        Object.keys(this.definition.routes).forEach((r) => {
            this.configureRoute(r, passport);
        });

        //setup our error handling
        this.configureErrorHandler(passport);

        return resolve();
    });
};

module.exports = function(
    app,
    definition,
    controllerInstance,
    templateRenderer,
    express,
    path,
    hostnameResolver,
    dataResolver,
    environmentService,
    sqlSessionStore,
    tagControllers
) {
    if (!controllerInstance) {
        controllerInstance = require('./controllerInstance');
    }

    if (!templateRenderer) {
        templateRenderer = require('./templating/render')();
    }

    if (!express) {
        express = require('express');
    }

    if (!path) {
        path = require('path');
    }

    if (!hostnameResolver) {
        hostnameResolver = require('../../support.lib/hostnameResolver')();
    }

    if (!dataResolver) {
        dataResolver = require('../../support.lib/dataResolver')();
    }

    if (!environmentService) {
        environmentService = require('../../support.lib/environmentService')();
    }

    if (!sqlSessionStore) {
        sqlSessionStore = require('../../support.lib/sqlSessionStore');
    }

    if (!tagControllers) {
        delete require.cache[require.resolve('./tagControllers')];
        tagControllers = require('./tagControllers')();
    }

    return new websiteInstance(
        app,
        definition,
        controllerInstance,
        templateRenderer,
        express,
        path,
        hostnameResolver,
        dataResolver,
        environmentService,
        sqlSessionStore,
        tagControllers
    );
};