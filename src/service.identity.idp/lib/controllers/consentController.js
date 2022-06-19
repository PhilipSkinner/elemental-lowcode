const consent = function(provider, accountService, clientHelper) {
    this.provider = provider;
    this.accountService = accountService;
    this.clientHelper = clientHelper;
};

consent.prototype.showConsent = function(req, res, next) {
    let details = null;
    let account = null;

    this.provider.interactionDetails(req, res).then((_details) => {
        details = _details;
        return this.accountService.findAccount(null, details.session.accountId);
    }).then((_account) => {
        account = _account;
        return this.provider.Client.find(details.params.client_id);
    }).then((client) => {
        if (this.clientHelper.termsOrPrivacyRequired(account, client)) {
            //the user must accept the terms now
            return this.provider.interactionFinished(req, res, {
                select_account : {},
                login : {
                    account : account.accountId
                },
                prompt : "terms"
            });
        }

        if (this.clientHelper.validationRequired(account, client)) {
            return this.provider.interactionFinished(req, res, {
                select_account : {},
                login : {
                    account : account.accountId
                },
                prompt : "validate"
            });
        }

        return res.render("consents", {
            client    : client,
            uid       : details.uid,
            details   : details.prompt.details,
            params    : details.params,
            title     : "Authorize",
        });
    }).catch((err) => {
        next(err);
    });
};

consent.prototype.confirmConsent = function(req, res, next) {
    this.provider.interactionDetails(req, res).then((details) => {
        let pageName = details.prompt.name;

        //exit out if this interaction isn"t for this page
        if (pageName !== "consent") {
            res.redirect(`/interaction/${req.params.uid}`);
            return;
        }
        const consent = {
            rejectedScopes  : [],
            rejectedClaims  : [],
            replace         : false
        };

        return this.provider.interactionFinished(req, res, {
            consent : consent
        }, { mergeWithLastSubmission: true });
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

    return new consent(provider, accountService, clientHelper);
};