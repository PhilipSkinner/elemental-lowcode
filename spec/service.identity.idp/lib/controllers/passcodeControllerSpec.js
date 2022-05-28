const
    sinon               = require('sinon'),
    passcodeController  = require('../../../../src/service.identity.idp/lib/controllers/passcodeController');

const provider = {

};

const tokenHandler = {
    tokenCheck : () => {}
};

const totpHelper = {
    generateTotp : () => {},
    verifyTotp   : () => {},
};

const certProvider = {
    fetchPrivateSigningKey : () => {}
};

const constructorTest = () => {
    const instance = passcodeController('hello');

    expect(instance.provider).toEqual('hello');
    expect(instance.tokenHandler).not.toBe(undefined);
    expect(instance.tokenHandler).not.toBe(null);
    expect(instance.totpHelper).not.toBe(undefined);
    expect(instance.totpHelper).not.toBe(null);
    expect(instance.certProvider).not.toBe(undefined);
    expect(instance.certProvider).not.toBe(null);
};

const generatePasscodeExceptionTest = (done) => {
    const tokenHandlerMock = sinon.mock(tokenHandler);
    const res = {
        status : (code) => {
            expect(code).toEqual(500);
        },
        send : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: token error'
                ]
            });
        },
        end : () => {
            tokenHandlerMock.verify();

            done();
        }
    };
    tokenHandlerMock.expects('tokenCheck').once().withArgs('req', res).callsArgWith(2, new Error('token error'));

    const instance = passcodeController('provider', tokenHandler, totpHelper, certProvider);
    instance.generatePasscode('req', res);
};

const generatePasscodeNullResource = (done) => {
    const tokenHandlerMock = sinon.mock(tokenHandler);
    const req = {
        body : {
            resource : null
        },
        headers : {}
    };
    const res = {
        status : (code) => {
            expect(code).toEqual(400);
        },
        send : (data) => {
            expect(data).toEqual({
                errors : [
                    'Resource is required when generating a passcode'
                ]
            });
        },
        end : () => {
            tokenHandlerMock.verify();

            done();
        }
    };
    tokenHandlerMock.expects('tokenCheck').once().withArgs(req, res).callsArgWith(2, null);

    const instance = passcodeController('provider', tokenHandler, totpHelper, certProvider);
    instance.generatePasscode(req, res);
};

const generatePasscodeTest = (done) => {
    const tokenHandlerMock = sinon.mock(tokenHandler);
    const certProviderMock = sinon.mock(certProvider);
    const totpMock = sinon.mock(totpHelper);

    const req = {
        body : {
            resource : "http://hello.world"
        },
        headers : {}
    };
    const res = {
        status : (code) => {
            expect(code).toEqual(200);
        },
        send : (data) => {
            expect(data).toEqual('my-totp');
        },
        end : () => {
            tokenHandlerMock.verify();
            certProviderMock.verify();
            totpMock.verify();

            done();
        }
    };

    tokenHandlerMock.expects('tokenCheck').once().withArgs(req, res).callsArgWith(2, null);
    certProviderMock.expects('fetchPrivateSigningKey').once().returns('my-private-key');
    totpMock.expects('generateTotp').once().withArgs('http://hello.world-my-private-key', {
        time : 5,
        window : 60
    }).returns('my-totp');

    const instance = passcodeController('provider', tokenHandler, totpHelper, certProvider);
    instance.generatePasscode(req, res);
};

const validatePasscodeUndefinedResourceTest = (done) => {
    const req = {
        body : {
            resource : null,
            code : null
        },
        headers : {}
    };
    const res = {
        status : (code) => {
            expect(code).toEqual(400);
        },
        send : (data) => {
            expect(data).toEqual({
                errors : [
                    'Resource is required when validating a passcode'
                ]
            });
        },
        end : () => {
            done();
        }
    };

    const instance = passcodeController('provider', tokenHandler, totpHelper, certProvider);
    instance.validatePasscode(req, res);
};

const validatePasscodeUndefinedCodeTest = (done) => {
    const req = {
        body : {
            resource : 'this-thing',
            code : null
        },
        headers : {}
    };
    const res = {
        status : (code) => {
            expect(code).toEqual(400);
        },
        send : (data) => {
            expect(data).toEqual({
                errors : [
                    'Code is required when validating a passcode'
                ]
            });
        },
        end : () => {
            done();
        }
    };

    const instance = passcodeController('provider', tokenHandler, totpHelper, certProvider);
    instance.validatePasscode(req, res);
};

const validatePasscodeWorks = (done) => {
    const certProviderMock = sinon.mock(certProvider);
    const totpMock = sinon.mock(totpHelper);

    const req = {
        body : {
            resource : 'this-thing',
            code : 'a-code'
        },
        headers : {}
    };
    const res = {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            totpMock.verify();
            certProviderMock.verify();

            done();
        }
    };

    certProviderMock.expects('fetchPrivateSigningKey').once().returns('a-cert');
    totpMock.expects('verifyTotp').once().withArgs('this-thing-a-cert', 'a-code', {
        time : 5,
        window : 60
    }).returns(true);

    const instance = passcodeController('provider', tokenHandler, totpHelper, certProvider);
    instance.validatePasscode(req, res);
};

const validatePasscodeReject = (done) => {
    const certProviderMock = sinon.mock(certProvider);
    const totpMock = sinon.mock(totpHelper);

    const req = {
        body : {
            resource : 'this-thing',
            code : 'a-code'
        },
        headers : {}
    };
    const res = {
        status : (code) => {
            expect(code).toEqual(401);
        },
        end : () => {
            totpMock.verify();
            certProviderMock.verify();

            done();
        }
    };

    certProviderMock.expects('fetchPrivateSigningKey').once().returns('a-cert');
    totpMock.expects('verifyTotp').once().withArgs('this-thing-a-cert', 'a-code', {
        time : 5,
        window : 60
    }).returns(false);

    const instance = passcodeController('provider', tokenHandler, totpHelper, certProvider);
    instance.validatePasscode(req, res);
};

describe('A passcode controller', () => {
    it('supports constructor defaulting', constructorTest);

    describe('generatePasscode', () => {
        it('supports exceptions', generatePasscodeExceptionTest);
        it('supports null resource', generatePasscodeNullResource);
        it('works', generatePasscodeTest);
    });

    describe('validatePasscode', () => {
        it('supports undefined resources', validatePasscodeUndefinedResourceTest);
        it('supports undefined codes', validatePasscodeUndefinedCodeTest);
        it('validates valid codes', validatePasscodeWorks);
        it('validates invalid codes', validatePasscodeReject);
    });
});