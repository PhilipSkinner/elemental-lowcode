const terms = function(provider, accountService, clientHelper) {
    this.provider = provider;
    this.accountService = accountService;
    this.clientHelper = clientHelper;
};

terms.prototype.showTermsForm = function(req, res, next) {
    let details = null;
    let account = null;

    this.provider.interactionDetails(req, res).then((_details) => {
        details = _details;
        return this.accountService.findAccount(null, details.session.accountId);
    }).then((_account) => {
        account = _account;
        return this.provider.Client.find(details.params.client_id);
    }).then((client) => {
        if (!this.clientHelper.termsOrPrivacyRequired(account, client)) {
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

        return res.render("terms", {
            client          : client,
            uid             : details.uid,
            details         : details.prompt.details,
            params          : details.params,
            termsRequired   : this.clientHelper.termsRequired(account, client),
            privacyRequired : this.clientHelper.privacyRequired(account, client),
            termsError      : details.lastSubmission && details.lastSubmission.termsError,
            privacyError    : details.lastSubmission && details.lastSubmission.privacyError,
            title           : "Terms & Conditions",
        });
    }).catch((err) => {
        next(err);
    });
};

terms.prototype.handleTerms = function(req, res, next) {
    let details = null;
    let account = null;

    this.provider.interactionDetails(req, res).then((_details) => {
        details = _details;
        return this.accountService.findAccount(null, details.session.accountId);
    }).then((_account) => {
        account = _account;
        return this.provider.Client.find(details.params.client_id);
    }).then((client) => {
        if (!this.clientHelper.termsOrPrivacyRequired(account, client)) {
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

        let termsError = false;
        let privacyError = false;

        account.profile.claims.implicit_consent = [];

        if (this.clientHelper.termsRequired(account, client)) {
            //if the terms are required we must check that they have been accepted
            if (client.features.terms.required === true) {
                if (!req.body.terms) {
                    termsError = true;
                }
            }

            if (!termsError) {
                //update the users terms by issuing the claims
                account.profile.claims[client.features.terms.issue_to] = client.features.terms.version;

                if (client.features.terms.implicit_consents) {
                    account.profile.claims.implicit_consent = account.profile.claims.implicit_consent.concat(client.features.terms.implicit_consents);
                }
            }
        } else if (client.features.terms) {
            account.profile.claims.implicit_consent = account.profile.claims.implicit_consent.concat(client.features.terms.implicit_consents);
        }

        if (this.clientHelper.privacyRequired(account, client)) {
            if (client.features.privacy.required === true) {
                if (!req.body.privacy) {
                    privacyError = true;
                }
            }

            if (!privacyError) {
                //update the users privacy by issuing the claims
                account.profile.claims[client.features.privacy.issue_to] = client.features.privacy.version;

                if (client.features.privacy.implicit_consents) {
                    account.profile.claims.implicit_consent = account.profile.claims.implicit_consent.concat(client.features.privacy.implicit_consents);
                }
            }
        } else if (client.features.privacy) {
            account.profile.claims.implicit_consent = account.profile.claims.implicit_consent.concat(client.features.privacy.implicit_consents);
        }

        if (termsError || privacyError) {
            return this.provider.interactionFinished(req, res, {
                prompt       : "terms",
                termsError   : termsError,
                privacyError : privacyError
            }, {
                mergeWithLastSubmission : false
            });
        }

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
    }).catch((err) => {
        next(err);
    });
};

module.exports = function(provider, accountService, clientHelper) {
    if (!accountService) {
        accountService = require("../account")();
    }

    if (!clientHelper) {
        clientHelper = require("../helpers/clientHelper")();
    }

    return new terms(provider, accountService, clientHelper);
};