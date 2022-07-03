const
    sinon           = require('sinon'),
    securityHandler = require('../../src/support.lib/securityHandler');

const tokenHandler = {
    tokenCheck : () => {}
};

const roleCheckHandler = {
    enforceRoles : () => {}
};

const constructorTest = (done) => {
    const instance = securityHandler();
    expect(instance.tokenHandler).not.toBe(undefined);
    expect(instance.tokenHandler).not.toBe(null);
    expect(instance.roleCheckHandler).not.toBe(undefined);
    expect(instance.roleCheckHandler).not.toBe(null);
    done();
};

const noSecurityTest = (done) => {
    const instance = securityHandler();

    instance.enforce((req, res) => {
        expect(req).toEqual('req');
        expect(res).toEqual('res');

        done();
    }, {
        mechanism : "none"
    })('req', 'res');
};

const invalidTokenTest = (done) => {
    const tokenHandlerMock = sinon.mock(tokenHandler);
    tokenHandlerMock.expects('tokenCheck').once().withArgs('req', 'res').callsArgWith(2, new Error('oh noes'));

    const instance = securityHandler(tokenHandler, roleCheckHandler);

    instance.enforce('ignore', {})('req', 'res', (err) => {
        expect(err).toEqual(new Error('oh noes'));

        tokenHandlerMock.verify();

        done();
    });
};

const enforceRolesTest = (done) => {
    const tokenHandlerMock = sinon.mock(tokenHandler);
    tokenHandlerMock.expects('tokenCheck').once().withArgs('req', 'res').callsArg(2);

    const roleCheckHandlerMock = sinon.mock(roleCheckHandler);
    roleCheckHandlerMock.expects('enforceRoles').once().withArgs('ignore', 'my-roles').returns((req, res) => {
        expect(req).toEqual('req');
        expect(res).toEqual('res');

        tokenHandlerMock.verify();
        roleCheckHandlerMock.verify();

        done();
    });

    const instance = securityHandler(tokenHandler, roleCheckHandler);

    instance.enforce('ignore', {
        roles : 'my-roles'
    })('req', 'res');
};

describe('A security handler', () => {
    it('handles constructor defaulting', constructorTest);

    describe('can enforce', () => {
        it('no security', noSecurityTest);

        describe('default security', () => {
            it('with invalid tokens', invalidTokenTest);
            it('enforcing roles', enforceRolesTest);
        });
    });
});