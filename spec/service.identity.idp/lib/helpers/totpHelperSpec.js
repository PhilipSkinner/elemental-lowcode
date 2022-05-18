const
    sinon       = require('sinon'),
    totpHelper  = require('../../../../src/service.identity.idp/lib/helpers/totpHelper');

const totpGenerator = {
    gen : () => {},
    verify : () => {}
};

const generateTotpTest = () => {
    const totpMock = sinon.mock(totpGenerator);
    totpMock.expects('gen').once().withArgs('hello', 'world').returns('totp-value');

    const instance = totpHelper(totpGenerator);

    expect(instance.generateTotp('hello', 'world')).toEqual('totp-value');

    totpMock.verify();
};

const verifyTotpTest = () => {
    const totpMock = sinon.mock(totpGenerator);
    totpMock.expects('verify').once().withArgs('world', 'hello', 'settings').returns('verified!');

    const instance = totpHelper(totpGenerator);

    expect(instance.verifyTotp('hello', 'world', 'settings')).toEqual('verified!');

    totpMock.verify();
};

describe('A totp helper', () => {
    it('can generate a totp', generateTotpTest);
    it('can verify a totp', verifyTotpTest);
});