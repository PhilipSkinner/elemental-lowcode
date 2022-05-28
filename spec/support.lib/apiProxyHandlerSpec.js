const
    sinon               = require('sinon'),
    apiProxyHandler     = require('../../src/support.lib/apiProxyHandler');

const refreshingTokenSessionStore = {
    createSession : () => {},
    getToken : () => {}
};

const request = {
    get : () => {}
};

const _generateToken = (header, body, sig) => {
    return [
        Buffer.from(JSON.stringify(header)).toString('base64'),
        Buffer.from(JSON.stringify(body)).toString('base64'),
        sig
    ].join('.');
};

const constructorTest = () => {
    const instance = new apiProxyHandler();
    expect(instance.refreshingTokenSessionStore).not.toBe(undefined);
    expect(instance.request).not.toBe(undefined);
};

const addTokensTest = (done) => {
    const storeMock = sinon.mock(refreshingTokenSessionStore);
    storeMock.expects('createSession').once().withArgs('access', 'identity', 'refresh').returns('1234');

    const instance = apiProxyHandler({}, refreshingTokenSessionStore, request);

    instance.addTokens({
        clearCookie : (name) => {
            expect(name).toEqual('session');
        },
        cookie : (name, id) => {
            expect(name).toEqual('session');
            expect(id).toEqual('1234');

            storeMock.verify();

            done();
        }
    }, {
        access_token : 'access',
        id_token : 'identity',
        refresh_token : 'refresh'
    });
};

const getRolesException = (done) => {
    const storeMock = sinon.mock(refreshingTokenSessionStore);
    storeMock.expects('getToken').once().withArgs('provider', 'scope', '1234').returns(Promise.reject(new Error('bad times')));

    const instance = apiProxyHandler({}, refreshingTokenSessionStore, request);

    instance.getRoles('provider', 'scope')({
        cookies : {
            session : '1234'
        }
    }, {}, (err) => {
        expect(err).toEqual(new Error('bad times'));

        storeMock.verify();

        done();
    });
};

const getRolesNullToken = (done) => {
    const storeMock = sinon.mock(refreshingTokenSessionStore);
    storeMock.expects('getToken').once().withArgs('provider', 'scope', '1234').returns(Promise.resolve(null));

    const instance = apiProxyHandler({}, refreshingTokenSessionStore, request);

    instance.getRoles('provider', 'scope')({
        cookies : {
            session : '1234'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(401);
        },
        end : () => {
            storeMock.verify();

            done();
        }
    });
};

const getRolesTest = (done) => {
    const storeMock = sinon.mock(refreshingTokenSessionStore);
    storeMock.expects('getToken').once().withArgs('provider', 'scope', '1234').returns(Promise.resolve(_generateToken({}, {
        role : [
            'hello',
            'there'
        ],
        roles : [
            'general',
            'kenobi'
        ]
    }, 'ignore')));

    const instance = apiProxyHandler({}, refreshingTokenSessionStore, request);

    instance.getRoles('provider', 'scope')({
        cookies : {
            session : '1234'
        }
    }, {
        json : (data) => {
            expect(data).toEqual([
                'hello',
                'there',
                'general',
                'kenobi'
            ]);

            storeMock.verify();

            done();
        }
    });
};

const getRolesNotArrayTest = (done) => {
    const storeMock = sinon.mock(refreshingTokenSessionStore);
    storeMock.expects('getToken').once().withArgs('provider', 'scope', '1234').returns(Promise.resolve(_generateToken({}, {
        role : 'hello',
        roles : 'there'
    }, 'ignore')));

    const instance = apiProxyHandler({}, refreshingTokenSessionStore, request);

    instance.getRoles('provider', 'scope')({
        cookies : {
            session : '1234'
        }
    }, {
        json : (data) => {
            expect(data).toEqual([
                'hello',
                'there'
            ]);

            storeMock.verify();

            done();
        }
    });
};

const getRolesNoRolesTest = (done) => {
    const storeMock = sinon.mock(refreshingTokenSessionStore);
    storeMock.expects('getToken').once().withArgs('provider', 'scope', '1234').returns(Promise.resolve(_generateToken({}, {

    }, 'ignore')));

    const instance = apiProxyHandler({}, refreshingTokenSessionStore, request);

    instance.getRoles('provider', 'scope')({
        cookies : {
            session : '1234'
        }
    }, {
        json : (data) => {
            expect(data).toEqual([]);

            storeMock.verify();

            done();
        }
    });
};

const rawBodyHandlerTest = (done) => {
    const instance = apiProxyHandler({}, refreshingTokenSessionStore, request);

    const req = {
        on : (type, cb) => {
            if (type === 'data') {
                cb('hello');
                cb('world');
            }

            if (type === 'end') {
                cb();
            }
        }
    };

    instance.rawBodyHandler(req, null, () => {
        expect(req.rawBody.toString('utf8')).toEqual('helloworld');

        done();
    });
};

const handlerException = (done) => {
    const storeMock = sinon.mock(refreshingTokenSessionStore);
    storeMock.expects('getToken').once().withArgs('provider', 'scope', '1234').returns(Promise.reject(new Error('bad times')));

    const instance = apiProxyHandler({}, refreshingTokenSessionStore, request);

    instance.handler('provider', 'scope')({
        cookies : {
            session : '1234'
        }
    }, {}, (err) => {
        expect(err).toEqual(new Error('bad times'));

        storeMock.verify();

        done();
    });
};

const handlerNullToken = (done) => {
    const storeMock = sinon.mock(refreshingTokenSessionStore);
    storeMock.expects('getToken').once().withArgs('provider', 'scope', '1234').returns(Promise.resolve(null));

    const instance = apiProxyHandler({}, refreshingTokenSessionStore, request);

    instance.handler('provider', 'scope')({
        cookies : {
            session : '1234'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(401);
        },
        end : () => {
            storeMock.verify();

            done();
        }
    });
};

const handlerRequestError = (done) => {
    const storeMock = sinon.mock(refreshingTokenSessionStore);
    storeMock.expects('getToken').once().withArgs('provider', 'scope', '1234').returns(Promise.resolve('token'));

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://doot.com/hello/world', {
        headers : {
            Authorization : 'Bearer token'
        },
        body : undefined,
        encoding : null
    }).callsArgWith(2, new Error('oh noes'));

    const instance = apiProxyHandler({
        doot : 'http://doot.com'
    }, refreshingTokenSessionStore, request);

    instance.handler('provider', 'scope')({
        cookies : {
            session : '1234'
        },
        method : 'GET',
        headers : {
            'x-forward-to' : 'doot',
            'x-forward-path' : '/hello/world'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);

            storeMock.verify();
            requestMock.verify();

            done();
        }
    });
};

const handlerTest = (done) => {
    const storeMock = sinon.mock(refreshingTokenSessionStore);
    storeMock.expects('getToken').once().withArgs('provider', 'scope', '1234').returns(Promise.resolve('token'));

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://doot.com/hello/world', {
        headers : {
            Authorization : 'Bearer token'
        },
        body : undefined,
        encoding : null
    }).callsArgWith(2, null, {
        statusCode : 123,
        headers : {
            hello : 'world'
        }
    }, 'the-body');

    const instance = apiProxyHandler({
        doot : 'http://doot.com'
    }, refreshingTokenSessionStore, request);

    instance.handler('provider', 'scope')({
        cookies : {
            session : '1234'
        },
        method : 'GET',
        headers : {
            'x-forward-to' : 'doot',
            'x-forward-path' : '/hello/world'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(123);
        },
        header : (name, value) => {
            expect(name).toEqual('hello');
            expect(value).toEqual('world');
        },
        end : (body) => {
            expect(body).toEqual('the-body');

            storeMock.verify();
            requestMock.verify();

            done();
        }
    });
};

describe('A secure API proxy', () => {
    it('defaults its constructor', constructorTest);

    describe('addTokens', () => {
        it('creates the session', addTokensTest);
    });

    describe('getRoles', () => {
        it('handles exceptions', getRolesException);
        it('handles null tokens', getRolesNullToken);
        it('returns the roles', getRolesTest);
        it('handles none array types', getRolesNotArrayTest);
        it('handles no roles', getRolesNoRolesTest);
    });

    describe('rawBodyHandler', () => {
        it('concats the body', rawBodyHandlerTest);
    });

    describe('handler', () => {
        it('handles exceptions', handlerException);
        it('handles null tokens', handlerNullToken);
        it('handles request errors', handlerRequestError);
        it('proxies the request', handlerTest);
    });
});