const login = function(provider, accountService, clientHelper, passwordHelper) {
    this.provider = provider;
    this.accountService = accountService;
    this.clientHelper = clientHelper;
    this.passwordHelper = passwordHelper;
};

login.prototype.showLoginForm = function(req, res, next) {
    let details = null;
    this.provider.interactionDetails(req, res).then((_details) => {
        details = _details;

        let pageName = details.prompt.name;
        if (details.lastSubmission && details.lastSubmission.prompt) {
            pageName = details.lastSubmission.prompt;
        }

        //exit out if this interaction isn't for this page
        if (pageName !== 'login') {
            res.redirect(`/interaction/${req.params.uid}`);
            return;
        }

        return this.provider.Client.find(details.params.client_id);
    }).then((client) => {
        if (!client) {
            return;
        }

        return res.render('login', {
            authError           : details.lastSubmission && details.lastSubmission.login && details.lastSubmission.login.account === null ? true : false,
            usernameError       : details.lastSubmission && details.lastSubmission.username_error ? true : false,
            passwordError       : details.lastSubmission && details.lastSubmission.password_error ? true : false,
            client              : client,
            uid                 : details.uid,
            details             : details.prompt.details,
            params              : details.params,
            newAccount          : details.lastSubmission && details.lastSubmission.new_account,
            title               : 'Sign-in',
            registrationEnabled : this.clientHelper.registrationEnabled(client),
            resetEnabled        : this.clientHelper.resetEnabled(client),
        });
    }).catch((err) => {
        next(err);
        return;
    });
};

login.prototype.handleLogin = function(req, res, next) {
    let details = null;
    let client = null;
    this.provider.interactionDetails(req, res).then((_details) => {
        details = _details;
        return this.provider.Client.find(details.params.client_id);
    }).then((_client) => {
        client = _client;
        return this.accountService.findByLogin(req.body.login, req.body.password);
    }).then((account) => {
        if (account) {
            if (this.clientHelper.termsOrPrivacyRequired(account, client)) {
                //the user must accept the terms now
                return this.provider.interactionFinished(req, res, {
                    select_account : {},
                    login : {
                        account : account.accountId
                    },
                    prompt : 'terms'
                }, { mergeWithLastSubmission: false });
            }

            const rules = this.clientHelper.getPasswordRules(client);
            const bannedPasswords = this.clientHelper.getBannedPasswords(client);
            const isBanned = this.passwordHelper.isBannedPassword(bannedPasswords, req.body.password);
            if (
                !this.passwordHelper.passwordStrongEnough(rules, req.body.password)
                || isBanned
            ) {
                return this.provider.interactionFinished(req, res, {
                    select_account : {},
                    login : {
                        account : account.accountId
                    },
                    prompt : 'password',
                    password_error  : isBanned ? 'That password is not allowed - it has been banned.' : null,
                }, { mergeWithLastSubmission : false });
            }
        }

        const result = {
            select_account: {},
            username_error : typeof(req.body.login) === 'undefined' || req.body.login === null || req.body.login.replace(/ /g, '') === '',
            password_error : typeof(req.body.password) === 'undefined' || req.body.password === null || req.body.password.replace(/ /g, '') === '',
            login: {
                account : account && account.accountId ? account.accountId : null,
            },
        };

        return this.provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
    }).catch((err) => {
        console.log(err);
        next(err);
        return;
    });
};

module.exports = function(provider, accountService, clientHelper, passwordHelper) {
    if (!accountService) {
        accountService = require('../account')();
    }

    if (!clientHelper) {
        clientHelper = require('../helpers/clientHelper')();
    }

    if (!passwordHelper) {
        passwordHelper = require('../helpers/passwordHelper')();
    }

    return new login(provider, accountService, clientHelper, passwordHelper);
};