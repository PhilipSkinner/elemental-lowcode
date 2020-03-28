const websiteInstance = function(app, definition, controllerInstance, templateRenderer, express, path) {
	this.app 					= app;
	this.definition 			= definition;
	this.controllerInstance 	= controllerInstance;
	this.templateRenderer 		= templateRenderer;
	this.express 				= express;
	this.path 					= path;
};

websiteInstance.prototype.configureTag = function(tag) {
	this.templateRenderer.registerCustomTag(tag);
};

websiteInstance.prototype.configureStatic = function() {
	this.app.use(
		`/${this.definition.name}/static`, 
		this.express.static(this.path.join(process.cwd(), process.env.DIR, `${this.definition.name}-static`))
	);
};

websiteInstance.prototype.configureRoute = function(route, passport) {
	let instance = this.controllerInstance(this.definition.routes[route], this.templateRenderer, this.definition.client, passport);

	console.log(`Hosting ${route} on ${this.definition.name} - /${this.definition.name}${route}`);
	this.app.get(`/${this.definition.name}${route}`, instance.handler.bind(instance));
	this.app.post(`/${this.definition.name}${route}`, instance.handler.bind(instance));
};

websiteInstance.prototype.init = function() {
	return new Promise((resolve, reject) => {
		//setup our static hosting
		this.configureStatic();

		//setup our custom tags
		this.definition.tags.forEach((t) => {
			this.configureTag(t);
		});

		let passport = null;
		//setup our security if we have a client defined
		if (typeof(this.definition.client) !== 'undefined' && this.definition.client !== null) {
			const oidc = require("passport-oauth2");
			passport = require("passport");
			passport.use(new oidc({
				authorizationURL 	: "http://localhost:8008/auth",
				tokenURL 			: "http://localhost:8008/token",
				clientID			: this.definition.client.client_id,
				clientSecret 		: this.definition.client.client_secret,
				callbackURL 		: `http://localhost:8005/${this.definition.name}/_auth`,
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

			//setup our authentication
			this.app.use(require("express-session")({
				name 				: `session.${this.definition.name}`,
				path 				: `/${this.definition.name}`,
	  			secret 				: this.definition.name,
	  			resave 			  	: true,
	  			saveUninitialized 	: true
			}));
			this.app.use(`/${this.definition.name}`, passport.initialize());
			this.app.use(`/${this.definition.name}`, passport.session());
			this.app.use(`/${this.definition.name}/_auth`, passport.authenticate("oauth2", {
				failureRedirect : `/${this.definition.name}`,
				successRedirect : `/${this.definition.name}`
			}));
		}

		//setup our routes
		Object.keys(this.definition.routes).forEach((r) => {
			this.configureRoute(r, passport);
		});

		return resolve();
	});
};

module.exports = function(app, definition, controllerInstance, templateRenderer, express, path) {
	if (!controllerInstance) {
		controllerInstance = require("./controllerInstance");
	}

	if (!templateRenderer) {
		templateRenderer = require("./templating/render")();
	}

	if (!express) {
		express = require("express");
	}

	if (!path) {
		path = require("path");
	}

	return new websiteInstance(app, definition, controllerInstance, templateRenderer, express, path);
};