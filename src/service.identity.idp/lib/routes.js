const routes = function(
    app,
    provider,
    interactionController,
    loginController,
    registerController,
    consentController,
    abortController,
    termsController,
    passwordController,
    passcodeController,
    validationController
) {
    this.app                    = app;
    this.provider               = provider;
    this.interactionController  = interactionController;
    this.loginController        = loginController;
    this.registerController     = registerController;
    this.consentController      = consentController;
    this.abortController        = abortController;
    this.termsController        = termsController;
    this.passwordController     = passwordController;
    this.passcodeController     = passcodeController;
    this.validationController   = validationController;

    //call init
    this.init();
};

routes.prototype.addLayout = function(req, res, next) {
    const orig = res.render;
    res.render = (view, locals) => {
        this.app.render(view, locals, (err, html) => {
            if (err) throw err;
            orig.call(res, "_layout", {
                ...locals,
                body: html,
            });
        });
    };
    next();
};

routes.prototype.errorHandler = function(err, req, res, next) {
    //need to stop this from wiping out the interaction
    if (err instanceof this.provider.constructor.errors.SessionNotFound) {
        // handle interaction expired / session not found error
        next(err);
    }

    return res.render("error", {
        error     : err,
        title     : "Error",
    });
};

routes.prototype.setNoCache = function(req, res, next) {
    res.set("Pragma", "no-cache");
    res.set("Cache-Control", "no-cache, no-store");
    next();
};

routes.prototype.init = function() {
    //add our layout middleware
    this.app.use(this.addLayout.bind(this));

    //interaction spawn point
    this.app.get("/interaction/:uid",            this.setNoCache.bind(this), this.interactionController.handleInteraction.bind(this.interactionController));

    //login routes
    this.app.get("/interaction/:uid/login",      this.setNoCache.bind(this), this.loginController.showLoginForm.bind(this.loginController));
    this.app.post("/interaction/:uid/login",     this.setNoCache.bind(this), this.loginController.handleLogin.bind(this.loginController));

    //registration routes
    this.app.get("/interaction/:uid/register",   this.setNoCache.bind(this), this.registerController.showRegistrationForm.bind(this.registerController));
    this.app.post("/interaction/:uid/register",  this.setNoCache.bind(this), this.registerController.handleRegistration.bind(this.registerController));

    //consents
    this.app.get("/interaction/:uid/consent",    this.setNoCache.bind(this), this.consentController.showConsent.bind(this.consentController));
    this.app.post("/interaction/:uid/confirm",   this.setNoCache.bind(this), this.consentController.confirmConsent.bind(this.consentController));

    //terms
    this.app.get("/interaction/:uid/terms",      this.setNoCache.bind(this), this.termsController.showTermsForm.bind(this.termsController));
    this.app.post("/interaction/:uid/terms",     this.setNoCache.bind(this), this.termsController.handleTerms.bind(this.termsController));

    //password
    this.app.get("/interaction/:uid/password",   this.setNoCache.bind(this), this.passwordController.showPasswordForm.bind(this.passwordController));
    this.app.post("/interaction/:uid/password",  this.setNoCache.bind(this), this.passwordController.handlePassword.bind(this.passwordController));
    this.app.get("/interaction/:uid/forgotten",  this.setNoCache.bind(this), this.passwordController.showForgottenPasswordForm.bind(this.passwordController));
    this.app.post("/interaction/:uid/forgotten", this.setNoCache.bind(this), this.passwordController.sendVerificationEmail.bind(this.passwordController));
    this.app.get("/interaction/:uid/code",       this.setNoCache.bind(this), this.passwordController.handleResetCode.bind(this.passwordController));
    this.app.post("/interaction/:uid/code",      this.setNoCache.bind(this), this.passwordController.handleResetCode.bind(this.passwordController));
    this.app.post("/interaction/:uid/reset",     this.setNoCache.bind(this), this.passwordController.resetPassword.bind(this.passwordController));

    //validate
    this.app.get("/interaction/:uid/validate",   this.setNoCache.bind(this), this.validationController.showValidationForm.bind(this.validationController));
    this.app.post("/interaction/:uid/validate",  this.setNoCache.bind(this), this.validationController.showValidationForm.bind(this.validationController));

    //abort
    this.app.get("/interaction/:uid/abort",     this.setNoCache.bind(this), this.abortController.abortRequest.bind(this.abortController));

    //one time passcode generation
    this.app.post("/passcode/generate",         this.setNoCache.bind(this), this.passcodeController.generatePasscode.bind(this.passcodeController));
    this.app.post("/passcode/validate",         this.setNoCache.bind(this), this.passcodeController.validatePasscode.bind(this.passcodeController));

    //add our error handler
    this.app.use(this.errorHandler.bind(this));
};

module.exports = (
    app,
    provider,
    interactionController,
    loginController,
    registerController,
    consentController,
    abortController,
    termsController,
    passwordController,
    passcodeController,
    validationController
) => {
    if (!interactionController) {
        interactionController = require("./controllers/interactionController")(provider);
    }

    if (!loginController) {
        loginController = require("./controllers/loginController")(provider);
    }

    if (!registerController) {
        registerController = require("./controllers/registerController")(provider);
    }

    if (!consentController) {
        consentController = require("./controllers/consentController")(provider);
    }

    if (!abortController) {
        abortController = require("./controllers/abortController")(provider);
    }

    if (!termsController) {
        termsController = require("./controllers/termsController")(provider);
    }

    if (!passwordController) {
        passwordController = require("./controllers/passwordController")(provider);
    }

    if (!passcodeController) {
        passcodeController = require("./controllers/passcodeController")(provider);
    }

    if (!validationController) {
        validationController = require("./controllers/validationController")(provider);
    }

    return new routes(
        app,
        provider,
        interactionController,
        loginController,
        registerController,
        consentController,
        abortController,
        termsController,
        passwordController,
        passcodeController,
        validationController
    );
};