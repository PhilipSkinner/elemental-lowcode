const register = function(provider, accountService, clientHelper, passwordHelper, emailValidator) {
    this.provider = provider;
    this.accountService = accountService;
    this.clientHelper = clientHelper;
    this.passwordHelper = passwordHelper;
    this.emailValidator = emailValidator;
};

register.prototype.showRegistrationForm = function(req, res, next) {
    let details = null;

    this.provider.interactionDetails(req, res).then((_details) => {
        details = _details;
        return this.provider.Client.find(details.params.client_id);
    }).then((client) => {
        if (!this.clientHelper.registrationEnabled(client)) {
            //not good, redirect back to login
            return this.provider.interactionFinished(req, res, {
                prompt : 'login'
            }, {
                mergeWithLastSubmission : false
            });
        }

        return res.render('register', {
            client          : client,
            uid             : details.uid,
            params          : details.params,
            details         : details.lastSubmission && details.lastSubmission.details ? details.lastSubmission.details : {},
            duplicate       : details.lastSubmission && details.lastSubmission.duplicate,
            passwordError   : details.lastSubmission ? details.lastSubmission.password_error : null,
            title           : 'Register',
        });
    }).catch((err) => {
        next(err);
        return;
    });
};

register.prototype.handleRegistration = function(req, res, next) {
    this.provider.interactionDetails(req, res).then((details) => {
        return this.provider.Client.find(details.params.client_id);
    }).then((client) => {
        if (!this.clientHelper.registrationEnabled(client)) {
            //not good, redirect back to login
            return this.provider.interactionFinished(req, res, {
                prompt : 'login'
            }, {
                mergeWithLastSubmission : false
            });
        }

        const details = {
            username : req.body.login
        };

        if (typeof(details.username) === 'undefined' || details.username === null || details.username.replace(/ /g, '') === '') {
            return this.provider.interactionFinished(req, res, {
                select_account  : {},
                prompt          : 'register',
                password_error  : 'You must provide a username.',
                details         : details,
                login           : {
                    account : null,
                }
            }, {
                mergeWithLastSubmission: false
            });
        }

        if (!this.emailValidator.validate(details.username)) {
            return this.provider.interactionFinished(req, res, {
                select_account  : {},
                prompt          : 'register',
                password_error  : 'You did not enter a correctly formatted email address.',
                details         : details,
                login           : {
                    account : null,
                }
            }, {
                mergeWithLastSubmission: false
            });
        }

        //check our password rules
        const rules = this.clientHelper.getPasswordRules(client);
        if (!this.passwordHelper.passwordStrongEnough(rules, req.body.password)) {
            return this.provider.interactionFinished(req, res, {
                select_account  : {},
                prompt          : 'register',
                password_error  : rules.error,
                details         : details,
                login           : {
                    account : null,
                }
            }, {
                mergeWithLastSubmission: false
            });
        }

        const bannedPasswords = this.clientHelper.getBannedPasswords(client);
        if (this.passwordHelper.isBannedPassword(bannedPasswords, req.body.password)) {
            return this.provider.interactionFinished(req, res, {
                select_account  : {},
                prompt          : 'register',
                password_error  : 'That password is not allowed - it has been banned.',
                details         : details,
                login           : {
                    account : null,
                }
            }, {
                mergeWithLastSubmission: false
            });
        }

        return this.accountService.registerUser(req.body.login, req.body.password).then((account) => {
            //null if there was an error
            if (!account) {
                return this.provider.interactionFinished(req, res, {
                    select_account : {},
                    prompt : 'register',
                    details : details,
                    duplicate : true,
                    login : {
                        account : null,
                    }
                }, {
                    mergeWithLastSubmission: false
                });
            } else {
                return this.provider.interactionFinished(req, res, {
                    select_account: {},
                    login: {
                        account : account.subject
                    },
                }, {
                    mergeWithLastSubmission: false
                });
            }
        });
    }).catch((err) => {
        next(err);
    });
};

module.exports = function(provider, accountService, clientHelper, passwordHelper, emailValidator) {
    if (!accountService) {
        accountService = require('../account')();
    }

    if (!clientHelper) {
        clientHelper = require('../helpers/clientHelper')();
    }

    if (!passwordHelper) {
        passwordHelper = require('../helpers/passwordHelper')();
    }

    if (!emailValidator) {
        emailValidator = require('email-validator');
    }

    return new register(provider, accountService, clientHelper, passwordHelper, emailValidator);
};