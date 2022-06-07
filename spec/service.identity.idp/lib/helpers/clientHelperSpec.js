const
    clientHelper = require('../../../../src/service.identity.idp/lib/helpers/clientHelper');

const passwordRulesNoClient = () => {
    const instance = clientHelper();

    expect(instance.getPasswordRules(null)).toEqual(instance.defaultPasswordRules);
};

const passwordRulesNoFeatures = () => {
    const instance = clientHelper();

    expect(instance.getPasswordRules({})).toEqual(instance.defaultPasswordRules);
};

const passwordRulesNoRules = () => {
    const instance = clientHelper();

    expect(instance.getPasswordRules({
        features : {}
    })).toEqual(instance.defaultPasswordRules);
};

const passwordRulesMerge = () => {
    const instance = clientHelper();

    expect(instance.getPasswordRules({
        features : {
            password : {
                min_length  : 234,
                error       : "woot",
                rules       : {
                    alpha       : 2,
                    numeric     : 3,
                    symbols     : 4,
                    mixed_case  : true
                },
                validation_regex : "my-regex"
            }
        }
    })).toEqual({
        max_length  : 999,
        min_length  : 234,
        error       : "woot",
        rules       : {
            alpha       : 2,
            numeric     : 3,
            symbols     : 4,
            mixed_case  : true
        },
        validation_regex : "my-regex"
    });
};

const bannedPasswordsNoPasswords = () => {
    const instance = clientHelper();

    expect(instance.getBannedPasswords({
        features : {}
    })).toEqual([]);
};

const bannedPasswordsTest = () => {
    const instance = clientHelper();

    expect(instance.getBannedPasswords({
        features : {
            banned_passwords : [
                'hello world'
            ]
        }
    })).toEqual([
        'hello world'
    ]);
};

const resetEnabledTest = () => {
    const instance = clientHelper();

    expect(instance.resetEnabled({
        features : {
            reset : {
                enabled : true
            }
        }
    })).toBe(true);
};

const resetNotEnabledTest = () => {
    const instance = clientHelper();

    expect(instance.resetEnabled({
        features : {
            reset : {
                enabled : false
            }
        }
    })).toBe(false);
};

const getEmailAddressDefault = () => {
    const instance = clientHelper();

    expect(instance.getFromEmailAddress({})).toEqual('noreply@lowcode.live');
};

const getEmailAddressClientEmail = () => {
    const instance = clientHelper();

    expect(instance.getFromEmailAddress({
        features : {
            email_from : 'hello@world.com'
        }
    })).toEqual('hello@world.com');
};

const termsRequiredNullAccount = () => {
    const instance = clientHelper();

    expect(instance.termsRequired(null, null)).toBe(false);
};

const termsRequiredNullClient = () => {
    const instance = clientHelper();

    expect(instance.termsRequired({}, null)).toBe(false);
};

const privacyRequiredNullAccount = () => {
    const instance = clientHelper();

    expect(instance.privacyRequired(null, null)).toBe(false);
};

const privacyRequiredNullClient = () => {
    const instance = clientHelper();

    expect(instance.privacyRequired({}, null)).toBe(false);
};

const totpNullClient = () => {
    const instance = clientHelper();

    expect(instance.getTotpSettings(null)).toEqual(instance.defaultTotpSettings);
};

const totpNullClientFeatures = () => {
    const instance = clientHelper();

    expect(instance.getTotpSettings({
        features : null
    })).toEqual(instance.defaultTotpSettings);
};

const totpNullSettings = () => {
    const instance = clientHelper();

    expect(instance.getTotpSettings({
        features : {
            totp : null
        }
    })).toEqual(instance.defaultTotpSettings);
};

const totpMergeTest = () => {
    const instance = clientHelper();

    expect(instance.getTotpSettings({
        features : {
            totp : {
                time : 10,
                window : 100
            }
        }
    })).toEqual({
        time : 10,
        window : 100
    });
};

const resetNotificationEnabled = () => {
    const instance = clientHelper();

    expect(instance.resetNotificationEnabled({
        features : {
            reset : {
                notify : true
            }
        }
    })).toEqual(true);
};

const resetNotificationNotEnabled = () => {
    const instance = clientHelper();

    expect(instance.resetNotificationEnabled({
        features : {
            reset : {
                notify : false
            }
        }
    })).toEqual(false);
};

describe('A client helper', () => {
    describe('getPasswordRules', () => {
        it('returns the defaults when there is no client', passwordRulesNoClient);
        it('returns the defaults when there are no client features', passwordRulesNoFeatures);
        it('returns the defaults when there are no client password rules', passwordRulesNoRules);
        it('merges the rules', passwordRulesMerge);
    });

    describe('getBannedPasswords', () => {
        it('returns an empty list when there is no passwords', bannedPasswordsNoPasswords);
        it('returns the banned passwords', bannedPasswordsTest);
    });

    describe('resetEnabled', () => {
        it('can determine if password reset is enabled', resetEnabledTest);
        it('can determine when reset is not enabled', resetNotEnabledTest);
    });

    describe('getFromEmailAddress', () => {
        it('returns the default email address', getEmailAddressDefault);
        it('returns the clients email address', getEmailAddressClientEmail);
    });

    describe('termsRequired', () => {
        it('works without an account', termsRequiredNullAccount);
        it('works without a client', termsRequiredNullClient);
    });

    describe('privacyRequired', () => {
        it('works without an account', privacyRequiredNullAccount);
        it('works without a client', privacyRequiredNullClient);
    });

    describe('getTotpSettings', () => {
        it('returns default with no client', totpNullClient);
        it('returns default with no client features', totpNullClientFeatures);
        it('returns default with no totp settings', totpNullSettings);
        it('merges the totp settings', totpMergeTest);
    });

    describe('resetNotificationEnabled', () => {
        it('can determine if password reset notifications are enabled', resetNotificationEnabled);
        it('can determine if password reset notifications are not enabled', resetNotificationNotEnabled);
    });
});