const
    passwordHelper = require('../../../../src/service.identity.idp/lib/helpers/passwordHelper');

const rules = {
    max_length : 18,
    min_length : 2,
    rules : {
        alpha : 2,
        numeric : 2,
        symbols : 2,
        mixed_case : true
    },
    validation_regex : "heLL0w0rLd!!"
};

const passwordMaxLength = () => {
    const instance = passwordHelper();

    expect(instance.passwordStrongEnough(rules, 'this is too long and will fail')).toBe(false);
};

const passwordMinLength = () => {
    const instance = passwordHelper();

    expect(instance.passwordStrongEnough(rules, '1')).toBe(false);
};

const passwordAlpha = () => {
    const instance = passwordHelper();

    expect(instance.passwordStrongEnough(rules, '111111')).toBe(false);
};

const passwordNumeric = () => {
    const instance = passwordHelper();

    expect(instance.passwordStrongEnough(rules, 'password')).toBe(false);
};

const passwordSymbols = () => {
    const instance = passwordHelper();

    expect(instance.passwordStrongEnough(rules, 'hell0w0rld')).toBe(false);
};

const passwordMixedCase = () => {
    const instance = passwordHelper();

    expect(instance.passwordStrongEnough(rules, 'hell0w0rld!!')).toBe(false);
};

const passwordRegex = () => {
    const instance = passwordHelper();

    expect(instance.passwordStrongEnough(rules, 'heLL0w0rld!!:(')).toBe(false);
};

const passwordStrongEnough = () => {
    const instance = passwordHelper();

    expect(instance.passwordStrongEnough(rules, 'heLL0w0rLd!!')).toBe(true);
};

const isBannedPasswordBadTest = () => {
    const instance = passwordHelper();

    expect(instance.isBannedPassword([], 'world')).toEqual(false);
    expect(instance.isBannedPassword(undefined, 'hello')).toEqual(false);
    expect(instance.isBannedPassword(null, 'hello')).toEqual(false);
    expect(instance.isBannedPassword({}, 'hello')).toEqual(false);
};

const isBannedPasswordTest = () => {
    const instance = passwordHelper();

    expect(instance.isBannedPassword(['hello'], 'world')).toEqual(false);
    expect(instance.isBannedPassword(['hello'], 'hello')).toEqual(true);
};

describe('A password helper', () => {
    describe('passwordStrongEnough', () => {
        it('enforces maximum length', passwordMaxLength);
        it('enforces minimum length', passwordMinLength);
        it('enforces alpha counts', passwordAlpha);
        it('enforces numeric counts', passwordNumeric);
        it('enforces symbols', passwordSymbols);
        it('enforces mixed case', passwordMixedCase);
        it('enforces regexes', passwordRegex);
        it('returns true when strong enough', passwordStrongEnough);
    });

    describe('isBannedPassword', () => {
        it('handles bad ban lists', isBannedPasswordBadTest);
        it('works', isBannedPasswordTest);
    });
});