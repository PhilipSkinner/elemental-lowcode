const passwordController = function(provider, accountService, clientHelper, passwordHelper, emailService, totpGenerator, ejs, path, hostnameResolver) {
    this.provider = provider;
    this.accountService = accountService;
    this.clientHelper = clientHelper;
    this.passwordHelper = passwordHelper;
    this.emailService = emailService;
    this.totpGenerator = totpGenerator;
    this.ejs = ejs;
    this.path = path;
    this.hostnameResolver = hostnameResolver;
};

passwordController.prototype.showPasswordForm = function(req, res, next) {
    let details = null;

    this.provider.interactionDetails(req, res).then((_details) => {
        details = _details;
        return this.provider.Client.find(details.params.client_id);
    }).then((client) => {
        //have we verified ourselves?
        if (details.session && details.session.accountId) {
            const rules = this.clientHelper.getPasswordRules(client);

            return res.render("password", {
                client          : client,
                uid             : details.uid,
                details         : details.prompt.details,
                params          : details.params,
                passwordError   : details.lastSubmission && details.lastSubmission.password_error ? details.lastSubmission.password_error : rules.error,
                title           : "Reset Password",
            });
        }

        return res.render("forgottenPassword", {
            client          : client,
            uid             : details.uid,
            details         : details.prompt.details,
            params          : details.params,
            title           : "Confirm email address",
            sent            : details.lastSubmission && details.lastSubmission.email_sent,
            code            : details.lastSubmission && details.lastSubmission.validation_code
        });
    }).catch((err) => {
        next(err);
    });
};

passwordController.prototype.handlePassword = function(req, res, next) {
    let details = null;
    let account = null;

    this.provider.interactionDetails(req, res).then((_details) => {
        details = _details;
        return this.accountService.findAccount(null, details.session.accountId);
    }).then((_account) => {
        account = _account;
        return this.provider.Client.find(details.params.client_id);
    }).then((client) => {
        //check our password rules
        const rules = this.clientHelper.getPasswordRules(client);
        if (!this.passwordHelper.passwordStrongEnough(rules, req.body.password)) {
            return this.provider.interactionFinished(req, res, {
                select_account  : {},
                prompt          : "password",
                password_error  : rules.error,
                login           : {
                    account : details.session.accountId,
                }
            }, {
                mergeWithLastSubmission: false
            });
        }

        const bannedPasswords = this.clientHelper.getBannedPasswords(client);
        if (this.passwordHelper.isBannedPassword(bannedPasswords, req.body.password)) {
            return this.provider.interactionFinished(req, res, {
                select_account  : {},
                prompt          : "password",
                password_error  : "That password is not allowed - it has been banned.",
                login           : {
                    account : details.session.accountId,
                }
            }, {
                mergeWithLastSubmission: false
            });
        }

        if (req.body.password !== req.body.repeat) {
            return this.provider.interactionFinished(req, res, {
                select_account  : {},
                prompt          : "password",
                password_error  : "Your passwords did not match.",
                login           : {
                    account : details.session.accountId,
                }
            }, {
                mergeWithLastSubmission: false
            });
        }

        //hash the password
        return this.accountService.generatePassword(req.body.password).then((hashed) => {
            //set the password
            account.profile.password = hashed;

            //save it
            return this.accountService.updateUser(account.accountId, account.profile).then(() => {
                return this.provider.interactionFinished(req, res, {
                    select_account: {},
                    login: {
                        account : account && account.accountId ? account.accountId : null,
                    },
                }, {
                    mergeWithLastSubmission : false
                });
            });
        });
    }).catch((err) => {
        next(err);
    });
};

passwordController.prototype.showForgottenPasswordForm = function(req, res, next) {
    let details = null;

    this.provider.interactionDetails(req, res).then((_details) => {
        details = _details;
        return this.provider.Client.find(details.params.client_id);
    }).then((client) => {
        //client hasn"t enabled resets
        if (!this.clientHelper.resetEnabled(client)) {
            //not good, redirect back to login
            return this.provider.interactionFinished(req, res, {
                prompt : "login"
            }, {
                mergeWithLastSubmission : false
            });
        }

        return res.render("forgottenPassword", {
            client          : client,
            uid             : details.uid,
            details         : details.prompt.details,
            params          : details.params,
            title           : "Confirm email address",
            sent            : details.lastSubmission && details.lastSubmission.email_sent,
            code            : details.lastSubmission && details.lastSubmission.validation_code
        });
    }).catch((err) => {
        next(err);
    });
};

passwordController.prototype.sendVerificationEmail = function(req, res, next) {
    let details = null;
    let validationCode = null;
    let skip = false;

    this.provider.interactionDetails(req, res).then((_details) => {
        details = _details;
        return this.provider.Client.find(details.params.client_id);
    }).then((client) => {
        if (!this.clientHelper.resetEnabled(client)) {
            //not good, redirect back to login
            skip = true;

            return this.provider.interactionFinished(req, res, {
                prompt : "login"
            }, {
                mergeWithLastSubmission : false
            });
        }

        //attempt to find the account
        return this.accountService.findByUsername(req.body.username).then((user) => {
            if (!user) {
                return Promise.resolve(null);
            }

            validationCode = this.totpGenerator.generateTotp(user.profile.subject, this.clientHelper.getTotpSettings(client));

            let template = "";

            if (client.features.reset.mechanism === "link-token") {
                template = "forgottenLinkToken";
            }

            if (client.features.reset.mechanism === "totp") {
                template = "forgottenTotpCode";
            }

            return this.ejs.renderFile(this.path.join(__dirname, `../../emails/${template}.ejs`), {
                code        : validationCode,
                idpHost     : this.hostnameResolver.resolveIdentity(),
                uid         : details.uid,
                username    : user.profile.username
            }).then((html) => {
                return this.emailService.sendEmail(
                    this.clientHelper.getFromEmailAddress(client),
                    user.profile.username,
                    "Reset password",
                    html
                );
            }).then(() => {
                return Promise.resolve(user.profile);
            });
        });
    }).then((user) => {
        if (skip) {
            return Promise.resolve();
        }

        let username = null;
        let subject = null;

        if (user && user.username) {
            username = user.username;
            subject = user.subject;
        }

        //we"ll just pretend that we sent the thing
        return this.provider.interactionFinished(req, res, {
            prompt : "code",
            email_sent : true,
            validation_code : validationCode,
            username : username,
            subject : subject,
        }, {
            mergeWithLastSubmission : true
        });
    }).catch((err) => {
        next(err);
    });
};

passwordController.prototype.handleResetCode = function(req, res, next) {
    let details = null;

    this.provider.interactionDetails(req, res).then((_details) => {
        details = _details;
        return this.provider.Client.find(details.params.client_id);
    }).then((client) => {
        if (!this.clientHelper.resetEnabled(client) || !details.lastSubmission) {
            //not good, redirect back to login
            return this.provider.interactionFinished(req, res, {
                prompt : "login"
            }, {
                mergeWithLastSubmission : false
            });
        }

        let receivedCode = req.query.code || req.body.code;
        let codeError = null;

        if (receivedCode) {
            receivedCode = receivedCode.trim();

            if (receivedCode === details.lastSubmission.validation_code && details.lastSubmission.validation_code !== null && typeof(details.lastSubmission.validation_code) !== "undefined") {
                //can reset their password now
                return res.render("resetPassword", {
                    client          : client,
                    uid             : details.uid,
                    details         : details.lastSubmission,
                    params          : details.params,
                    passwordError   : null,
                    title           : "Reset password"
                });
            } else {
                codeError = "That code is incorrect, please try again.";
            }
        }

        return res.render("resetCode", {
            client          : client,
            uid             : details.uid,
            details         : details.lastSubmission,
            params          : details.params,
            title           : "Confirmation code",
            sent            : details.lastSubmission && details.lastSubmission.email_sent,
            codeError       : codeError
        });
    }).catch((err) => {
        next(err);
    });
};

passwordController.prototype.resetPassword = function(req, res, next) {
    let details = null;
    let account = null;

    this.provider.interactionDetails(req, res).then((_details) => {
        details = _details;
        return this.accountService.findByUsername(details.lastSubmission.username);
    }).then((_account) => {
        account = _account;
        return this.provider.Client.find(details.params.client_id);
    }).then((client) => {
        if (!this.clientHelper.resetEnabled(client) || !details.lastSubmission) {
            //not good, redirect back to login
            return this.provider.interactionFinished(req, res, {
                prompt : "login"
            }, {
                mergeWithLastSubmission : false
            });
        }

        //check our password rules
        const rules = this.clientHelper.getPasswordRules(client);
        const bannedPasswords = this.clientHelper.getBannedPasswords(client);

        let passwordError = null;
        if (!this.passwordHelper.passwordStrongEnough(rules, req.body.password)) {
            passwordError = rules.error;
        } else if (this.passwordHelper.isBannedPassword(bannedPasswords, req.body.password)) {
            passwordError = "That password is not allowed - it has been banned.";
        } else if (req.body.password !== req.body.repeat) {
            passwordError = "Your passwords did not match.";
        }

        if (passwordError !== null) {
            return res.render("resetPassword", {
                client          : client,
                uid             : details.uid,
                details         : details.lastSubmission,
                params          : details.params,
                passwordError   : passwordError,
                title           : "Reset password"
            });
        }

        //hash the password
        return this.accountService.generatePassword(req.body.password).then((hashed) => {
            //set the password
            account.profile.password = hashed;

            //save it
            return this.accountService.updateUser(account.accountId, account.profile).then(() => {
                return this.provider.interactionFinished(req, res, {
                    select_account: {},
                    login: {
                        account : account && account.accountId ? account.accountId : null,
                    },
                }, {
                    mergeWithLastSubmission : false
                });
            });
        });
    }).catch((err) => {
        next(err);
    });
};

module.exports = function(provider, accountService, clientHelper, passwordHelper, emailService, totpGenerator, ejs, path, hostnameResolver) {
    if (!accountService) {
        accountService = require("../account")();
    }

    if (!clientHelper) {
        clientHelper = require("../helpers/clientHelper")();
    }

    if (!passwordHelper) {
        passwordHelper = require("../helpers/passwordHelper")();
    }

    if (!emailService) {
        emailService = require("../../../support.lib/emailService")({
            host : process.env.SMTP_HOST,
            port : process.env.SMTP_PORT,
            username : process.env.SMTP_USERNAME,
            password : process.env.SMTP_PASSWORD,
            protocol : process.env.SMTP_PROTOCOL
        });
    }

    if (!totpGenerator) {
        totpGenerator = require("../helpers/totpHelper")();
    }

    if (!ejs) {
        ejs = require("ejs");
    }

    if (!path) {
        path = require("path");
    }

    if (!hostnameResolver) {
        hostnameResolver = require("../../../support.lib/hostnameResolver")();
    }

    return new passwordController(provider, accountService, clientHelper, passwordHelper, emailService, totpGenerator, ejs, path, hostnameResolver);
};