const clientHelper = function() {
    this.defaultPasswordRules = {
        max_length  : 999,
        min_length  : 6,
        error       : "Your password must be 6 characters long and must contain atleast 1 letter, 1 number and 1 symbol.",
        rules       : {
            alpha       : 1,
            numeric     : 1,
            symbols     : 1,
            mixed_case  : false
        },
        validation_regex : ".*?"
    };

    this.defaultTotpSettings = {
        time : 5,
        window : 60
    };

    this.defaultEmailAddress = "noreply@elementalsystem.org";
};

clientHelper.prototype.getFromEmailAddress = function(client) {
    return client.features && client.features.email_from ? client.features.email_from : this.defaultEmailAddress;
};

clientHelper.prototype.getBannedPasswords = function(client) {
    return client.features && client.features.banned_passwords ? client.features.banned_passwords : [];
};

clientHelper.prototype.registrationEnabled = function(client) {
    return client.features && client.features.registration && client.features.registration.enabled === true;
};

clientHelper.prototype.resetEnabled = function(client) {
    return client.features && client.features.reset && client.features.reset.enabled === true;
};

clientHelper.prototype.resetNotificationEnabled = function(client) {
    return client.features && client.features.reset && client.features.reset.notify === true;
};

clientHelper.prototype.loginNotificationEnabled = function(client) {
    return client.features && client.features.login && client.features.login.notify === true;
};

clientHelper.prototype.getPasswordHelpers = function(client) {
    return client.features && client.features.password && client.features.password.helpers ? client.features.password.helpers : [];
};

clientHelper.prototype.termsRequired = function(account, client) {
    if (!account) {
        return false;
    }

    if (!client) {
        return false;
    }

    if (!(client.features && client.features.terms && client.features.terms.version && client.features.terms.issue_to)) {
        return false;
    }

    //has the user already accepted these terms?
    if (account.profile.claims && account.profile.claims[client.features.terms.issue_to] === client.features.terms.version) {
        return false;
    }

    return true;
};

clientHelper.prototype.privacyRequired = function(account, client) {
    if (!account) {
        return false;
    }

    if (!client) {
        return false;
    }

    if (!(client.features && client.features.privacy && client.features.privacy.version && client.features.privacy.issue_to)) {
        return false;
    }

    //has the user already accepted these terms?
    if (account.profile.claims && account.profile.claims[client.features.privacy.issue_to] === client.features.privacy.version) {
        return false;
    }

    return true;
};

clientHelper.prototype.getPasswordRules = function(client) {
    if (!client) {
        return this.defaultPasswordRules;
    }

    if (!client.features) {
        return this.defaultPasswordRules;
    }

    if (!client.features.password) {
        return this.defaultPasswordRules;
    }

    //mix the rules into the defaultRules
    const copy = JSON.parse(JSON.stringify(this.defaultPasswordRules));
    Object.assign(copy, client.features.password);

    return copy;
};

clientHelper.prototype.getTotpSettings = function(client) {
    if (!client) {
        return this.defaultTotpSettings;
    }

    if (!client.features) {
        return this.defaultTotpSettings;
    }

    if (!client.features.totp) {
        return this.defaultTotpSettings;
    }

    const copy = JSON.parse(JSON.stringify(this.defaultTotpSettings));
    Object.assign(copy, client.features.totp);

    return copy;
};

clientHelper.prototype.termsOrPrivacyRequired = function(account, client) {
    return this.termsRequired(account, client) || this.privacyRequired(account, client);
};

module.exports = () => {
    return new clientHelper();
};