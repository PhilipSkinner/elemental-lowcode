const validate = function(provider, accountService, clientHelper, emailService, totpGenerator, ejs, path, hostnameResolver) {
    this.provider           = provider;
    this.accountService     = accountService;
    this.clientHelper       = clientHelper;
    this.emailService       = emailService;
    this.totpGenerator      = totpGenerator;
    this.ejs                = ejs;
    this.path               = path;
    this.hostnameResolver   = hostnameResolver;
};

validate.prototype.showValidationForm = function(req, res, next) {
    let details = null;
    let account = null;

    this.provider.interactionDetails(req, res).then((_details) => {
        details = _details;
        return this.accountService.findAccount(null, details.session.accountId);
    }).then((_account) => {
        account = _account;
        return this.provider.Client.find(details.params.client_id);
    }).then((client) => {
        if (!this.clientHelper.validationRequired(account, client)) {
            //the user has already accepted the terms, redirect them back to the
            //start of the auth process
            return this.provider.interactionFinished(req, res, {
                select_account: {},
                login: {
                    account : account && account.accountId ? account.accountId : null,
                },
            }, {
                mergeWithLastSubmission : false
            });
        }

        let sent = false;
        let promise = Promise.resolve();
        const mechanism = this.clientHelper.validationMechanism(client);
        let shouldValidate = false;
        let validationCode = null;
        let validationError = null;

        if (req.method === "GET" && req.query.code && mechanism === "link-token") {
            //validate the code
            shouldValidate = true;
            validationCode = req.query.code;
        }

        if (req.method === "POST" && req.body.validate && mechanism === "totp") {
            //validate the code
            shouldValidate = true;
            validationCode = req.body.code;
        }

        if (shouldValidate) {
            if (this.totpGenerator.verifyTotp(account.profile.subject, `${validationCode.trim()}`, this.clientHelper.getTotpSettings(client))) {
                //update the account and continue with login
                account.profile.claims.validated_at = new Date().toISOString();

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
            }

            validationError = mechanism === "link-token" ? "The validation link was not valid, please try again." : "That code is not valid, please try again."
        }


        if (req.method === "POST" && req.body.send) {
            const validationCode = this.totpGenerator.generateTotp(account.profile.subject, this.clientHelper.getTotpSettings(client));

            let template = "";
            if (mechanism === "link-token") {
                template = "validateLinkToken";
            }

            if (mechanism === "totp") {
                template = "validateTotpCode";
            }

            promise = this.ejs.renderFile(this.path.join(__dirname, `../../emails/${template}.ejs`), {
                code        : validationCode,
                idpHost     : this.hostnameResolver.resolveIdentity(),
                uid         : details.uid,
                username    : account.profile.username
            }).then((html) => {
                sent = true;
                return this.emailService.sendEmail(
                    this.clientHelper.getFromEmailAddress(client),
                    account.profile.username,
                    "Validate account",
                    html
                );
            });
        }

        return promise.then(() => {
            return res.render("validate", {
                client          : client,
                uid             : details.uid,
                details         : details.prompt.details,
                params          : details.params,
                sent            : sent,
                mechanism       : mechanism,
                validationError : validationError,
                title           : "Account Validation",
            });
        });
    }).catch((err) => {
        next(err);
    });
};

module.exports = function(provider, accountService, clientHelper, emailService, totpGenerator, ejs, path, hostnameResolver) {
    if (!accountService) {
        accountService = require("../account")();
    }

    if (!clientHelper) {
        clientHelper = require("../helpers/clientHelper")();
    }

    if (!emailService) {
        emailService = require("../../../support.lib/emailService")({
            host        : process.env.SMTP_HOST,
            port        : process.env.SMTP_PORT,
            username    : process.env.SMTP_USERNAME,
            password    : process.env.SMTP_PASSWORD,
            protocol    : process.env.SMTP_PROTOCOL
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

    return new validate(provider, accountService, clientHelper, emailService, totpGenerator, ejs, path, hostnameResolver);
};