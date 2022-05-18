const
    sinon 			= require('sinon'),
    tokenHandler 	= require('../../src/support.lib/tokenHandler');

const jwt = {
    verify : () => {}
};

const hostnameResolver = {
    resolveIdentity : () => {},
    resolveExternalIdentity : () => {},
};

const request = {
    get : () => {}
};

const jwkToPem = {
    main : () => {}
};

const _generateToken = (header, body, sig) => {
    return [
        Buffer.from(JSON.stringify(header)).toString('base64'),
        Buffer.from(JSON.stringify(body)).toString('base64'),
        sig
    ].join('.');
};

const constructorTest = (done) => {
    const instance = tokenHandler();
    expect(instance.jwt).not.toBe(null);
    done();
};

const fetchPublicKeyTest = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveIdentity').once().returns('http://identity');
    hostnameMock.expects('resolveExternalIdentity').once().returns('http://external');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://identity/.well-known/openid-configuration').callsArgWith(1, null, null, '{"jwks_uri":"internal-uri"}');
    requestMock.expects('get').once().withArgs('internal-uri').callsArgWith(1, null, null, JSON.stringify({
        keys : [
            {
                kid : 'internalKid',
                key : 'internal-key'
            }
        ]
    }));

    requestMock.expects('get').once().withArgs('http://external/.well-known/openid-configuration').callsArgWith(1, null, null, '{"jwks_uri":"external-uri"}');
    requestMock.expects('get').once().withArgs('external-uri').callsArgWith(1, null, null, JSON.stringify({
        keys : [
            {
                kid : 'externalKid',
                key : 'external-key'
            }
        ]
    }));

    const jwkMock = sinon.mock(jwkToPem);
    jwkMock.expects('main').once().withArgs({
        kid : 'internalKid',
        key : 'internal-key'
    }).returns('parsed-internal-key');
    jwkMock.expects('main').once().withArgs({
        kid : 'externalKid',
        key : 'external-key'
    }).returns('parsed-external-key');

    const instance = tokenHandler(null, jwt, hostnameResolver, request, jwkToPem.main);

    setTimeout(() => {
        hostnameMock.verify();
        requestMock.verify();
        jwkMock.verify();

        expect(instance.publicKeys).toEqual({
            internalKid : 'parsed-internal-key',
            externalKid : 'parsed-external-key'
        });

        done();
    }, 5);
};

const fetchPublicKeyRetryTest = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveIdentity').once().returns('http://identity');
    hostnameMock.expects('resolveExternalIdentity').once().returns('http://external');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').twice().withArgs('http://identity/.well-known/openid-configuration').callsArgWith(1, null, null, '{"jwks_uri":"internal-uri"}');
    requestMock.expects('get').once().withArgs('internal-uri').callsArgWith(1, null, null, null);
    requestMock.expects('get').once().withArgs('internal-uri').callsArgWith(1, null, null, JSON.stringify({
        keys : [
            {
                kid : 'internalKid',
                key : 'internal-key'
            }
        ]
    }));

    requestMock.expects('get').twice().withArgs('http://external/.well-known/openid-configuration').callsArgWith(1, null, null, '{"jwks_uri":"external-uri"}');
    requestMock.expects('get').once().withArgs('external-uri').callsArgWith(1, null, null, null);
    requestMock.expects('get').once().withArgs('external-uri').callsArgWith(1, null, null, JSON.stringify({
        keys : [
            {
                kid : 'externalKid',
                key : 'external-key'
            }
        ]
    }));

    const jwkMock = sinon.mock(jwkToPem);
    jwkMock.expects('main').once().withArgs({
        kid : 'internalKid',
        key : 'internal-key'
    }).returns('parsed-internal-key');
    jwkMock.expects('main').once().withArgs({
        kid : 'externalKid',
        key : 'external-key'
    }).returns('parsed-external-key');

    const instance = tokenHandler(null, jwt, hostnameResolver, request, jwkToPem.main);

    setTimeout(() => {
        hostnameMock.verify();
        requestMock.verify();
        jwkMock.verify();

        expect(instance.publicKeys).toEqual({
            internalKid : 'parsed-internal-key',
            externalKid : 'parsed-external-key'
        });

        done();
    }, 600);
};

const tokenCheckIgnore = (done) => {
    const instance = tokenHandler({
        ignore : [
            /ignore-this/
        ]
    }, jwt, hostnameResolver, request, jwkToPem.main);

    instance.tokenCheck({
        path : 'ignore-this'
    }, {}, () => {
        done();
    });
};

const noTokenTest = (done) => {
    const instance = tokenHandler({
        ignore : [
            /ignore-this/
        ]
    }, jwt, hostnameResolver, request, jwkToPem.main);

    instance.tokenCheck({
        path : 'not-this',
        headers : {

        }
    }, {
        status : (code) => {
            expect(code).toEqual(401);
        },
        end : () => {
            done();
        }
    });
};

const undefinedAlgTest = (done) => {
    const instance = tokenHandler(null, jwt, hostnameResolver, request, jwkToPem.main);

    instance.tokenCheck({
        path : 'not-this',
        headers : {
            authorization : 'Bearer ' + _generateToken({ alg : '' }, {}, 'sig')
        }
    }, {
        status : (code) => {
            expect(code).toEqual(401);
        },
        end : () => {
            done();
        }
    });
};

const jwtVerifyErrors = (done) => {
    const token = _generateToken({ alg : 'alg', kid : 'internalKid' }, {}, 'sig');

    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveIdentity').twice().returns('http://identity');
    hostnameMock.expects('resolveExternalIdentity').twice().returns('http://external');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').twice().withArgs('http://identity/.well-known/openid-configuration').callsArgWith(1, null, null, '{"jwks_uri":"internal-uri"}');
    requestMock.expects('get').twice().withArgs('internal-uri').callsArgWith(1, null, null, JSON.stringify({
        keys : [
            {
                kid : 'internalKid',
                key : 'the-key'
            }
        ]
    }));

    requestMock.expects('get').twice().withArgs('http://external/.well-known/openid-configuration').callsArgWith(1, null, null, '{"jwks_uri":"external-uri"}');
    requestMock.expects('get').twice().withArgs('external-uri').callsArgWith(1, null, null, JSON.stringify({
        keys : [
            {
                kid : 'externalKid',
                key : 'external-key'
            }
        ]
    }));

    const jwkMock = sinon.mock(jwkToPem);
    jwkMock.expects('main').twice().withArgs({
        kid : 'internalKid',
        key : 'the-key'
    }).returns('parsed-internal-key');
    jwkMock.expects('main').twice().withArgs({
        kid : 'externalKid',
        key : 'external-key'
    }).returns('parsed-external-key');

    const jwtMock = sinon.mock(jwt);
    jwtMock.expects('verify').once().withArgs(token, undefined, {
        algorithms : ['alg']
    }).callsArgWith(3, new Error('not good'));
    jwtMock.expects('verify').once().withArgs(token, 'parsed-internal-key', {
        algorithms : ['alg']
    }).callsArgWith(3, new Error('not good'));

    const instance = tokenHandler(null, jwt, hostnameResolver, request, jwkToPem.main);

    instance.tokenCheck({
        path : 'not-this',
        headers : {
            authorization : 'Bearer ' + token
        }
    }, {
        status : (code) => {
            expect(code).toEqual(401);
        },
        end : () => {
            jwtMock.verify();
            hostnameMock.verify();
            requestMock.verify();
            jwkMock.verify();

            done();
        }
    });
};

const validTokenTest = (done) => {
    const token = _generateToken({ alg : 'alg', kid : 'the-key' }, {}, 'sig');

    const jwtMock = sinon.mock(jwt);
    jwtMock.expects('verify').once().withArgs(token, 'pem-value', {
        algorithms : ['alg']
    }).callsArgWith(3, null, 'decoded-token');

    const instance = tokenHandler(null, jwt, hostnameResolver, request, jwkToPem.main);
    instance.publicKeys['the-key'] = 'pem-value';

    const req = {
        path : 'not-this',
        headers : {
            authorization : 'Bearer ' + token
        }
    };

    instance.tokenCheck(req, {}, () => {
        expect(req.decoded).toEqual('decoded-token');

        jwtMock.verify();

        done();
    });
};

describe('A JWT token handler', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('fetch public keys', () => {
        it('works', fetchPublicKeyTest);
        it('does a retry', fetchPublicKeyRetryTest);
    });

    describe('token check', () => {
        it('handles ignore rules', tokenCheckIgnore);
        it('returns a 401 when there is no token', noTokenTest);
        it('handles undefined algorithms', undefinedAlgTest);
        it('handles jwt verification issues', jwtVerifyErrors);
        it('handles valid tokens', validTokenTest);
    });
});