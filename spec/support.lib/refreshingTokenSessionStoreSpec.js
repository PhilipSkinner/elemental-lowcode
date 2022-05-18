const
    sinon                       = require('sinon'),
    refreshingTokenSessionStore = require('../../src/support.lib/refreshingTokenSessionStore');

const sqlSessionStore = {
    set : () => {},
    get : () => {}
};

const uuid = {
    v4 : () => {}
};

const request = {
    post : () => {}
};

const _generateToken = (header, body, sig) => {
    return [
        Buffer.from(JSON.stringify(header)).toString('base64'),
        Buffer.from(JSON.stringify(body)).toString('base64'),
        sig
    ].join('.');
};

const constructorTest = () => {
    const instance = refreshingTokenSessionStore();
    expect(instance.sqlSessionStore).not.toBe(undefined);
    expect(instance.uuid).not.toBe(undefined);
    expect(instance.request).not.toBe(undefined);
};

const createSessionException = () => {
    const uuidMock = sinon.mock(uuid);
    uuidMock.expects('v4').once().returns('my-id');

    const storeMock = sinon.mock(sqlSessionStore);
    storeMock.expects('set').once().withArgs('my-id', {
        accessToken : 'access',
        idToken : 'identity',
        refreshToken : 'refresh'
    }).callsArgWith(2, new Error('oh noes'));

    const instance = refreshingTokenSessionStore(sqlSessionStore, uuid, request);

    expect(instance.createSession('access', 'identity', 'refresh')).toEqual('my-id');

    uuidMock.verify();
    storeMock.verify();
};

const createSessionTest = () => {
    const uuidMock = sinon.mock(uuid);
    uuidMock.expects('v4').once().returns('my-id');

    const storeMock = sinon.mock(sqlSessionStore);
    storeMock.expects('set').once().withArgs('my-id', {
        accessToken : 'access',
        idToken : 'identity',
        refreshToken : 'refresh'
    }).callsArgWith(2, null);

    const instance = refreshingTokenSessionStore(sqlSessionStore, uuid, request);

    expect(instance.createSession('access', 'identity', 'refresh')).toEqual('my-id');

    uuidMock.verify();
    storeMock.verify();
};

const getTokenExceptions = (done) => {
    const storeMock = sinon.mock(sqlSessionStore);
    storeMock.expects('get').once().withArgs('1234').callsArgWith(1, new Error('oops'));

    const instance = refreshingTokenSessionStore(sqlSessionStore, uuid, request);

    instance.getToken({}, 'scope', '1234').then((token) => {
        expect(token).toEqual(null);

        storeMock.verify();

        done();
    });
};

const getTokenNullSession = (done) => {
    const storeMock = sinon.mock(sqlSessionStore);
    storeMock.expects('get').once().withArgs('1234').callsArgWith(1, null, null);

    const instance = refreshingTokenSessionStore(sqlSessionStore, uuid, request);

    instance.getToken({}, 'scope', '1234').then((token) => {
        expect(token).toEqual(null);

        storeMock.verify();

        done();
    });
};

const getTokenExpiredToken = (done) => {
    const token = {
        accessToken: _generateToken({}, {
            exp : (new Date() - 3600) / 1000
        }, 'ignore'),
        refreshToken : 'refresh'
    };

    const storeMock = sinon.mock(sqlSessionStore);
    storeMock.expects('get').once().withArgs('1234').callsArgWith(1, null, token);
    storeMock.expects('set').once().withArgs('1234', {
        accessToken : 'noot noot',
        refreshToken : 'woot',
        idToken : 'doot'
    }).callsArgWith(2, null);

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://idp.com/token', {
        form : {
            grant_type : 'refresh_token',
            scope : 'scope',
            client_id : 'client-id',
            client_secret : 'client-secret',
            refresh_token : 'refresh'
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, JSON.stringify({
        access_token : 'noot noot',
        refresh_token : 'woot',
        id_token : 'doot'
    }));

    const instance = refreshingTokenSessionStore(sqlSessionStore, uuid, request);

    instance.getToken({
        authorizationCode : {
            config : {
                auth : {
                    tokenHost : 'http://idp.com',
                    tokenPath : '/token'
                },
                client : {
                    id : 'client-id',
                    secret : 'client-secret'
                }
            }
        }
    }, 'scope', '1234').then((token) => {
        expect(token).toEqual('noot noot');

        storeMock.verify();
        requestMock.verify();

        done();
    });
};

const getTokenExpiredTokenNoRefresh = (done) => {
    const token = {
        accessToken: _generateToken({}, {
            exp : (new Date() - 3600) / 1000
        }, 'ignore')
    };

    const storeMock = sinon.mock(sqlSessionStore);
    storeMock.expects('get').once().withArgs('1234').callsArgWith(1, null, token);

    const instance = refreshingTokenSessionStore(sqlSessionStore, uuid, request);

    instance.getToken({}, 'scope', '1234').then((token) => {
        expect(token).toEqual(token);

        storeMock.verify();

        done();
    });
};

const getTokenRefreshInvalidResponse = (done) => {
    const token = {
        accessToken: _generateToken({}, {
            exp : (new Date() - 3600) / 1000
        }, 'ignore'),
        refreshToken : 'refresh'
    };

    const storeMock = sinon.mock(sqlSessionStore);
    storeMock.expects('get').once().withArgs('1234').callsArgWith(1, null, token);

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://idp.com/token', {
        form : {
            grant_type : 'refresh_token',
            scope : 'scope',
            client_id : 'client-id',
            client_secret : 'client-secret',
            refresh_token : 'refresh'
        }
    }).callsArgWith(2, null, {
        statusCode : 500
    });

    const instance = refreshingTokenSessionStore(sqlSessionStore, uuid, request);

    instance.getToken({
        authorizationCode : {
            config : {
                auth : {
                    tokenHost : 'http://idp.com',
                    tokenPath : '/token'
                },
                client : {
                    id : 'client-id',
                    secret : 'client-secret'
                }
            }
        }
    }, 'scope', '1234').then((tkn) => {
        expect(tkn).toEqual(token.accessToken);

        storeMock.verify();
        requestMock.verify();

        done();
    });
};

const getTokenRefreshException = (done) => {
    const token = {
        accessToken: _generateToken({}, {
            exp : (new Date() - 3600) / 1000
        }, 'ignore'),
        refreshToken : 'refresh'
    };

    const storeMock = sinon.mock(sqlSessionStore);
    storeMock.expects('get').once().withArgs('1234').callsArgWith(1, null, token);
    storeMock.expects('set').once().withArgs('1234', {
        accessToken : 'noot noot',
        refreshToken : 'woot',
        idToken : 'doot'
    }).callsArgWith(2, new Error('oh noes'));

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://idp.com/token', {
        form : {
            grant_type : 'refresh_token',
            scope : 'scope',
            client_id : 'client-id',
            client_secret : 'client-secret',
            refresh_token : 'refresh'
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, JSON.stringify({
        access_token : 'noot noot',
        refresh_token : 'woot',
        id_token : 'doot'
    }));

    const instance = refreshingTokenSessionStore(sqlSessionStore, uuid, request);

    instance.getToken({
        authorizationCode : {
            config : {
                auth : {
                    tokenHost : 'http://idp.com',
                    tokenPath : '/token'
                },
                client : {
                    id : 'client-id',
                    secret : 'client-secret'
                }
            }
        }
    }, 'scope', '1234').then((token) => {
        expect(token).toEqual(null);

        storeMock.verify();
        requestMock.verify();

        done();
    });
};

const getToken = (done) => {
    const token = {
        accessToken: _generateToken({}, {
            exp : (new Date() - 1 + 1000000) / 1000
        }, 'ignore')
    };

    const storeMock = sinon.mock(sqlSessionStore);
    storeMock.expects('get').once().withArgs('1234').callsArgWith(1, null, token);

    const instance = refreshingTokenSessionStore(sqlSessionStore, uuid, request);

    instance.getToken({}, 'scope', '1234').then((token) => {
        expect(token).toEqual(token);

        storeMock.verify();

        done();
    });
};

const getIdTokenExceptions = (done) => {
    const storeMock = sinon.mock(sqlSessionStore);
    storeMock.expects('get').once().withArgs('1234').callsArgWith(1, new Error('oops'));

    const instance = refreshingTokenSessionStore(sqlSessionStore, uuid, request);

    instance.getIdToken({}, 'scope', '1234').then((token) => {
        expect(token).toEqual(null);

        storeMock.verify();

        done();
    });
};

const getIdTokenNullSession = (done) => {
    const storeMock = sinon.mock(sqlSessionStore);
    storeMock.expects('get').once().withArgs('1234').callsArgWith(1, null, null);

    const instance = refreshingTokenSessionStore(sqlSessionStore, uuid, request);

    instance.getIdToken({}, 'scope', '1234').then((token) => {
        expect(token).toEqual(null);

        storeMock.verify();

        done();
    });
};

const getIdTokenExpiredToken = (done) => {
    const token = {
        idToken: _generateToken({}, {
            exp : (new Date() - 3600) / 1000
        }, 'ignore'),
        refreshToken : 'refresh'
    };

    const storeMock = sinon.mock(sqlSessionStore);
    storeMock.expects('get').once().withArgs('1234').callsArgWith(1, null, token);
    storeMock.expects('set').once().withArgs('1234', {
        accessToken : 'noot noot',
        refreshToken : 'woot',
        idToken : 'doot'
    }).callsArgWith(2, null);

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://idp.com/token', {
        form : {
            grant_type : 'refresh_token',
            scope : 'scope',
            client_id : 'client-id',
            client_secret : 'client-secret',
            refresh_token : 'refresh'
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, JSON.stringify({
        access_token : 'noot noot',
        refresh_token : 'woot',
        id_token : 'doot'
    }));

    const instance = refreshingTokenSessionStore(sqlSessionStore, uuid, request);

    instance.getIdToken({
        authorizationCode : {
            config : {
                auth : {
                    tokenHost : 'http://idp.com',
                    tokenPath : '/token'
                },
                client : {
                    id : 'client-id',
                    secret : 'client-secret'
                }
            }
        }
    }, 'scope', '1234').then((token) => {
        expect(token).toEqual('noot noot');

        storeMock.verify();
        requestMock.verify();

        done();
    });
};

const getIdTokenExpiredTokenNoRefresh = (done) => {
    const token = {
        idToken: _generateToken({}, {
            exp : (new Date() - 3600) / 1000
        }, 'ignore')
    };

    const storeMock = sinon.mock(sqlSessionStore);
    storeMock.expects('get').once().withArgs('1234').callsArgWith(1, null, token);

    const instance = refreshingTokenSessionStore(sqlSessionStore, uuid, request);

    instance.getIdToken({}, 'scope', '1234').then((token) => {
        expect(token).toEqual(token);

        storeMock.verify();

        done();
    });
};

const getIdTokenRefreshInvalidResponse = (done) => {
    const token = {
        idToken: _generateToken({}, {
            exp : (new Date() - 3600) / 1000
        }, 'ignore'),
        refreshToken : 'refresh'
    };

    const storeMock = sinon.mock(sqlSessionStore);
    storeMock.expects('get').once().withArgs('1234').callsArgWith(1, null, token);

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://idp.com/token', {
        form : {
            grant_type : 'refresh_token',
            scope : 'scope',
            client_id : 'client-id',
            client_secret : 'client-secret',
            refresh_token : 'refresh'
        }
    }).callsArgWith(2, null, {
        statusCode : 500
    });

    const instance = refreshingTokenSessionStore(sqlSessionStore, uuid, request);

    instance.getIdToken({
        authorizationCode : {
            config : {
                auth : {
                    tokenHost : 'http://idp.com',
                    tokenPath : '/token'
                },
                client : {
                    id : 'client-id',
                    secret : 'client-secret'
                }
            }
        }
    }, 'scope', '1234').then((tkn) => {
        expect(tkn).toEqual(token.accessToken);

        storeMock.verify();
        requestMock.verify();

        done();
    });
};

const getIdTokenRefreshException = (done) => {
    const token = {
        idToken: _generateToken({}, {
            exp : (new Date() - 3600) / 1000
        }, 'ignore'),
        refreshToken : 'refresh'
    };

    const storeMock = sinon.mock(sqlSessionStore);
    storeMock.expects('get').once().withArgs('1234').callsArgWith(1, null, token);
    storeMock.expects('set').once().withArgs('1234', {
        accessToken : 'noot noot',
        refreshToken : 'woot',
        idToken : 'doot'
    }).callsArgWith(2, new Error('oh noes'));

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://idp.com/token', {
        form : {
            grant_type : 'refresh_token',
            scope : 'scope',
            client_id : 'client-id',
            client_secret : 'client-secret',
            refresh_token : 'refresh'
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, JSON.stringify({
        access_token : 'noot noot',
        refresh_token : 'woot',
        id_token : 'doot'
    }));

    const instance = refreshingTokenSessionStore(sqlSessionStore, uuid, request);

    instance.getIdToken({
        authorizationCode : {
            config : {
                auth : {
                    tokenHost : 'http://idp.com',
                    tokenPath : '/token'
                },
                client : {
                    id : 'client-id',
                    secret : 'client-secret'
                }
            }
        }
    }, 'scope', '1234').then((token) => {
        expect(token).toEqual(null);

        storeMock.verify();
        requestMock.verify();

        done();
    });
};

const getIdToken = (done) => {
    const token = {
        idToken: _generateToken({}, {
            exp : (new Date() - 1 + 1000000) / 1000
        }, 'ignore')
    };

    const storeMock = sinon.mock(sqlSessionStore);
    storeMock.expects('get').once().withArgs('1234').callsArgWith(1, null, token);

    const instance = refreshingTokenSessionStore(sqlSessionStore, uuid, request);

    instance.getIdToken({}, 'scope', '1234').then((token) => {
        expect(token).toEqual(token);

        storeMock.verify();

        done();
    });
};

describe('A refreshing token session store', () => {
    it('defaults its constructor', constructorTest);

    describe('createSession', () => {
        it('handles exceptions', createSessionException);
        it('creates the session', createSessionTest);
    });

    describe('getToken', () => {
        it('handles exceptions', getTokenExceptions);
        it('handles null sessions', getTokenNullSession);
        it('handles expired tokens', getTokenExpiredToken);
        it('handles expired tokens, no refresh token', getTokenExpiredTokenNoRefresh);
        it('handles expired tokens, invalid response', getTokenRefreshInvalidResponse);
        it('handles expired tokens, refresh error', getTokenRefreshException);
        it('returns an access token', getToken);
    });

    describe('getIdToken', () => {
        it('handles exceptions', getIdTokenExceptions);
        it('handles null sessions', getIdTokenNullSession);
        it('handles expired tokens', getIdTokenExpiredToken);
        it('handles expired tokens, no refresh token', getIdTokenExpiredTokenNoRefresh);
        it('handles expired tokens, invalid response', getIdTokenRefreshInvalidResponse);
        it('handles expired tokens, refresh error', getIdTokenRefreshException);
        it('returns an access token', getIdToken);
    });
});