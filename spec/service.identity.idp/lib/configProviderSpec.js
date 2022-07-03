const
    sinon 			= require('sinon'),
    configProvider 	= require('../../../src/service.identity.idp/lib/configProvider');

const glob = {
    main : () => {}
};

const path = {
    join : () => {}
};

const fs = {
    readFile : () => {}
};

const userDB = {
    findAccount : () => {},
    extraAccessTokenClaims : () => {}
};

const keyStore = function() {
    return jose.JWKS._KeyStore;
};

const jose = {
    JWK : {
        asKey : () => {

        },
    },
    JWKS : {
        _KeyStore : {
            toJWKS : () => {},
            add : () => {}
        },
        KeyStore : keyStore
    }
};

const db = {
    connect : () => {}
};

const hostnameResolver = {
    resolveAdmin : () => {}
};

const bcrypt = {
    hash : () => {}
};

const certProvider = {
    fetchPrivateSigningKey : () => { return 'priv'; },
    fetchPublicSigningKey : () => { return 'pub'; },
};

const defaultsTest = (done) => {
    const instance = configProvider(null, null, null, null, {}, {}, null, null, null);

    expect(instance.glob).not.toBe(null);
    expect(instance.path).not.toBe(null);
    expect(instance.fs).not.toBe(null);
    expect(instance.jose).not.toBe(null);
    expect(instance.userDB).not.toBe(null);
    expect(instance.db).not.toBe(null);
    expect(instance.hostnameResolver).not.toBe(null);
    expect(instance.bcrypt).not.toBe(null);
    expect(instance.certProvider).not.toBe(null);

    done();
};

const clientLoadTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), 'woot', '**/*.client.json').returns('woot/**/*.client.json');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('woot/**/*.client.json').callsArgWith(1, null, ['my.client.json']);

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my.client.json').callsArgWith(1, null, JSON.stringify({
        grant_types : 'wheee'
    }));

    const instance = configProvider(glob.main, path, fs, jose, userDB, db, hostnameResolver, bcrypt, certProvider);

    instance.getClients('woot', ['hello world']).then((clients) => {
        expect(clients).toEqual([
            {
                grant_types : 'wheee',
                features : {
                    banned_passwords : [
                        'hello world'
                    ]
                },
                response_types : [],
                redirect_uris : [
                    'http://ignore.me'
                ],
            }
        ]);

        pathMock.verify();
        pathMock.restore();
        globMock.verify();
        globMock.restore();
        fsMock.verify();
        fsMock.restore();

        done();
    });
};

const clientGrantDefaultTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), 'woot', '**/*.client.json').returns('woot/**/*.client.json');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('woot/**/*.client.json').callsArgWith(1, null, ['my.client.json']);

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my.client.json').callsArgWith(1, null, JSON.stringify({
        features : {
            banned_passwords : [
                'there',
                'is'
            ]
        }
    }));

    const instance = configProvider(glob.main, path, fs, jose, userDB, db, hostnameResolver, bcrypt, certProvider);

    instance.getClients('woot', ['something', 'here']).then((clients) => {
        expect(clients).toEqual([
            {
                grant_types : [
                    'client_credentials',
                    'authorization_code',
                    'refresh_token'
                ],
                response_types : [
                    'code',
                    'code id_token'
                ],
                redirect_uris : [
                    'http://ignore.me'
                ],
                features : {
                    banned_passwords : [
                        'there',
                        'is',
                        'something',
                        'here'
                    ]
                }
            }
        ]);

        pathMock.verify();
        pathMock.restore();
        globMock.verify();
        globMock.restore();
        fsMock.verify();
        fsMock.restore();

        done();
    });
};

const clientLoadNoClients = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), 'woot', '**/*.client.json').returns('woot/**/*.client.json');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('woot/**/*.client.json').callsArgWith(1, null, []);

    const fsMock = sinon.mock(fs);

    const instance = configProvider(glob.main, path, fs, jose, userDB, db, hostnameResolver, bcrypt, certProvider);

    instance.getClients('woot').then((clients) => {
        expect(clients).toEqual([]);

        pathMock.verify();
        pathMock.restore();
        globMock.verify();
        globMock.restore();
        fsMock.verify();
        fsMock.restore();

        done();
    });
};

const clientLoadUndefinedResult = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), 'woot', '**/*.client.json').returns('woot/**/*.client.json');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('woot/**/*.client.json').callsArgWith(1, null, null);

    const fsMock = sinon.mock(fs);

    const instance = configProvider(glob.main, path, fs, jose, userDB, db, hostnameResolver, bcrypt, certProvider);

    instance.getClients('woot').then((clients) => {
        expect(clients).toEqual([]);

        pathMock.verify();
        pathMock.restore();
        globMock.verify();
        globMock.restore();
        fsMock.verify();
        fsMock.restore();

        done();
    });
};

const clientFileErrors = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), 'woot', '**/*.client.json').returns('woot/**/*.client.json');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('woot/**/*.client.json').callsArgWith(1, null, ['my.client.json']);

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my.client.json').callsArgWith(1, new Error('not good'));

    const instance = configProvider(glob.main, path, fs, jose, userDB, db, hostnameResolver, bcrypt, certProvider);

    instance.getClients('woot').catch((err) => {
        expect(err).toEqual(new Error('not good'));

        pathMock.verify();
        pathMock.restore();
        globMock.verify();
        globMock.restore();
        fsMock.verify();
        fsMock.restore();

        done();
    });
};

const clientInvalidJSON = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), 'woot', '**/*.client.json').returns('woot/**/*.client.json');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('woot/**/*.client.json').callsArgWith(1, null, ['my.client.json']);

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my.client.json').callsArgWith(1, null, '}{}{}D{}{}{}{}{');

    const instance = configProvider(glob.main, path, fs, jose, userDB, db, hostnameResolver, bcrypt, certProvider);

    instance.getClients('woot').catch((err) => {
        expect(err).toEqual(new Error('Cannot read client config my.client.json'));

        pathMock.verify();
        pathMock.restore();
        globMock.verify();
        globMock.restore();
        fsMock.verify();
        fsMock.restore();

        done();
    });
};

const scopeLoadTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), 'woot', '**/*.scope.json').returns('woot/**/*.scope.json');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('woot/**/*.scope.json').callsArgWith(1, null, ['my.scope.json']);

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my.scope.json').callsArgWith(1, null, JSON.stringify({
        name : 'doot'
    }));

    const instance = configProvider(glob.main, path, fs, jose, userDB, db, hostnameResolver, bcrypt, certProvider);

    instance.getScopes('woot').then((scopes) => {
        expect(scopes).toEqual([
            {
                name : 'doot'
            }
        ]);

        pathMock.verify();
        pathMock.restore();
        globMock.verify();
        globMock.restore();
        fsMock.verify();
        fsMock.restore();

        done();
    });
};

const scopeLoadNoScopes = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), 'woot', '**/*.scope.json').returns('woot/**/*.scope.json');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('woot/**/*.scope.json').callsArgWith(1, null, []);

    const fsMock = sinon.mock(fs);

    const instance = configProvider(glob.main, path, fs, jose, userDB, db, hostnameResolver, bcrypt, certProvider);

    instance.getScopes('woot').then((scopes) => {
        expect(scopes).toEqual([]);

        pathMock.verify();
        pathMock.restore();
        globMock.verify();
        globMock.restore();
        fsMock.verify();
        fsMock.restore();

        done();
    });
};

const scopeLoadUndefinedResult = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), 'woot', '**/*.scope.json').returns('woot/**/*.scope.json');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('woot/**/*.scope.json').callsArgWith(1, null, null);

    const fsMock = sinon.mock(fs);

    const instance = configProvider(glob.main, path, fs, jose, userDB, db, hostnameResolver, bcrypt, certProvider);

    instance.getScopes('woot').then((scopes) => {
        expect(scopes).toEqual([]);

        pathMock.verify();
        pathMock.restore();
        globMock.verify();
        globMock.restore();
        fsMock.verify();
        fsMock.restore();

        done();
    });
};

const scopeFileErrors = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), 'woot', '**/*.scope.json').returns('woot/**/*.scope.json');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('woot/**/*.scope.json').callsArgWith(1, null, ['my.scope.json']);

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my.scope.json').callsArgWith(1, new Error('not good'));
    const instance = configProvider(glob.main, path, fs, jose, userDB, db, hostnameResolver, bcrypt, certProvider);

    instance.getScopes('woot').catch((err) => {
        expect(err).toEqual(new Error('not good'));

        pathMock.verify();
        pathMock.restore();
        globMock.verify();
        globMock.restore();
        fsMock.verify();
        fsMock.restore();

        done();
    });
};

const scopeInvalidJSON = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), 'woot', '**/*.scope.json').returns('woot/**/*.scope.json');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('woot/**/*.scope.json').callsArgWith(1, null, ['my.scope.json']);

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my.scope.json').callsArgWith(1, null, '{}{}{}S{}{SA}{D}{');

    const instance = configProvider(glob.main, path, fs, jose, userDB, db, hostnameResolver, bcrypt, certProvider);

    instance.getScopes('woot').catch((err) => {
        expect(err).toEqual(new Error('Cannot read scope config my.scope.json'));

        pathMock.verify();
        pathMock.restore();
        globMock.verify();
        globMock.restore();
        fsMock.verify();
        fsMock.restore();

        done();
    });
};

const adminClientTest = (done) => {
    const resolverMock = sinon.mock(hostnameResolver);
    resolverMock.expects('resolveAdmin').twice().returns('http://elemental');

    const instance = configProvider(glob.main, path, fs, jose, userDB, db, hostnameResolver, bcrypt, certProvider);

    instance.generateAdminClient('woot').then((client) => {
        expect(client).toEqual({
            client_id : 'elemental_admin',
            client_secret : 'woot',
            scope : 'openid roles offline_access',
            redirect_uris : [
                'http://elemental/auth'
            ],
            post_logout_redirect_uris : [
                'http://elemental'
            ],
            roles : [],
            grant_types : [
                'authorization_code',
                'client_credentials',
                'refresh_token'
            ],
            features : {
                registration : {
                    enabled : false
                }
            }
        });

        resolverMock.verify();
        resolverMock.restore();

        done();
    });
};

const jwksTest = (done) => {
    const keyMock = sinon.mock(jose.JWKS._KeyStore);
    keyMock.expects('add').once().withArgs('woot');
    keyMock.expects('toJWKS').once().withArgs(true).returns('keystore');

    const jwkMock = sinon.mock(jose.JWK);
    jwkMock.expects('asKey').once().withArgs({
        key : 'privpub',
        format : 'pem',
        type : 'pkcs8'
    }).returns('woot');

    const instance = configProvider(glob.main, path, fs, jose, userDB, db, hostnameResolver, bcrypt, certProvider);

    instance.addJwks().then((keystore) => {
        expect(keystore).toEqual('keystore');

        keyMock.verify();
        keyMock.restore();
        jwkMock.verify();
        jwkMock.restore();

        done();
    });
};

const cookieTest = (done) => {
    const instance = configProvider(glob.main, path, fs, jose, userDB, db, hostnameResolver, bcrypt, certProvider);

    instance.addCookies().then((config) => {
        expect(config.keys[0]).not.toBe(null);

        done();
    });
};

const adapterTest = (done) => {
    const dbMock = sinon.mock(db);
    dbMock.expects('connect').once().returns(Promise.resolve());

    const instance = configProvider(glob.main, path, fs, jose, userDB, db, hostnameResolver, bcrypt, certProvider);

    instance.addAdapter().then((config) => {
        expect(config).not.toBe(null);

        dbMock.verify();
        dbMock.restore();

        done();
    });
};

const fetchConfigTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), 'woot', 'banned.passwords.json').returns('woot/banned.passwords.json');
    pathMock.expects('join').once().withArgs(process.cwd(), 'woot', '**/*.client.json').returns('woot/**/*.client.json');
    pathMock.expects('join').once().withArgs(process.cwd(), 'woot', '**/*.scope.json').returns('woot/**/*.scope.json');

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('woot/banned.passwords.json').callsArgWith(1, null, '["hello world"]');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('woot/**/*.client.json').callsArgWith(1, null, []);
    globMock.expects('main').once().withArgs('woot/**/*.scope.json').callsArgWith(1, null, []);

    const resolverMock = sinon.mock(hostnameResolver);
    resolverMock.expects('resolveAdmin').twice().returns('http://elemental');

    const keyMock = sinon.mock(jose.JWKS._KeyStore);
    keyMock.expects('add').once().withArgs('woot');
    keyMock.expects('toJWKS').once().withArgs(true).returns('keystore');

    const jwkMock = sinon.mock(jose.JWK);
    jwkMock.expects('asKey').once().withArgs({
        key : 'privpub',
        format : 'pem',
        type : 'pkcs8'
    }).returns('woot');

    const dbMock = sinon.mock(db);
    dbMock.expects('connect').once().returns(Promise.resolve());

    const instance = configProvider(glob.main, path, fs, jose, userDB, db, hostnameResolver, bcrypt, certProvider);

    instance.fetchConfig('woot', 'doot').then((config) => {
        expect(config).toEqual({
            formats : {
                AccessToken : 'jwt',
                IdentityToken : 'jwt',
                ClientCredentials : 'jwt'
            },
        	conformIdTokenClaims : false,
        	features : {
    			devInteractions : {
    				enabled: false
    			},
    			clientCredentials : {
    				enabled: true
    			}
    		},
        	scopes : [
        		'openid',
        		'offline_access',
        		'roles'
    		],
        	claims : {
    			acr : null,
    			auth_time : null,
    			iss : null,
    			openid : [ 'sub', 'email' ],
    			roles : [ 'role', 'roles' ],
    			sid : null
            },
        	clients : [
        		{
    				client_id : 'elemental_admin',
    				client_secret : 'doot',
    				scope : 'openid roles offline_access',
    				redirect_uris : [
    					'http://elemental/auth'
                    ],
                    post_logout_redirect_uris : [
                        'http://elemental'
                    ],
                    roles : [],
                    grant_types : [
                        'authorization_code',
                        'client_credentials',
                        'refresh_token'
                    ],
                    features : {
                        registration : {
                            enabled : false
                        }
                    }
                }
            ],
        	jwks : 'keystore',
        	cookies : {
        		keys : [jasmine.any(String)],
        		long : {
                    httpOnly: true,
                    overwrite: true,
                    sameSite: 'lax',
                    maxAge : 86400000
                },
                short : {
                    httpOnly: true,
                    overwrite: true,
                    sameSite: 'lax',
                    maxAge : 21600000
                }
        	},
        	adapter : {
        		connect : jasmine.any(Function)
        	},
        	renderError : jasmine.any(Function),
        	findAccount : jasmine.any(Function),
            logoutSource : jasmine.any(Function),
            postLogoutSuccessSource : jasmine.any(Function),
        	extraAccessTokenClaims : undefined,
            extraClientMetadata : {
                properties : [
                    'features'
                ]
            },
            ttl : {
                AccessToken : jasmine.any(Function),
                AuthorizationCode : 1800,
                Interaction : 86400
            }
        });

        pathMock.verify();
        pathMock.restore();
        fsMock.verify();
        fsMock.restore();
        globMock.verify();
        globMock.restore();
        resolverMock.verify();
        resolverMock.restore();
        keyMock.verify();
        keyMock.restore();
        jwkMock.verify();
        jwkMock.restore();
        dbMock.verify();
        dbMock.restore();

        done();
    });
};

const getBannedPasswordsExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), 'my-dir', 'banned.passwords.json').returns('an-file.json');

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('an-file.json').callsArgWith(1, new Error('not good :('));

    const instance = configProvider(glob.main, path, fs, jose, userDB, db, hostnameResolver, bcrypt, certProvider);

    instance.getBannedPasswords('my-dir').then((result) => {
        expect(result).toEqual([]);

        pathMock.verify();
        fsMock.verify();

        done();
    });
};

const getBannedPasswordsInvalidJSON = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), 'my-dir', 'banned.passwords.json').returns('an-file.json');

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('an-file.json').callsArgWith(1, null, '{}{}{}}{}{}{}{D}{ASD}{DS}');

    const instance = configProvider(glob.main, path, fs, jose, userDB, db, hostnameResolver, bcrypt, certProvider);

    instance.getBannedPasswords('my-dir').then((result) => {
        expect(result).toEqual([]);

        pathMock.verify();
        fsMock.verify();

        done();
    });
};

describe('A config provider', () => {
    it('defaults its constructor args', defaultsTest);
    it('can generate an admin client', adminClientTest);
    it('can configure jwks', jwksTest);
    it('can configure cookies', cookieTest);
    it('can configure the db adapter', adapterTest);
    it('configures everything', fetchConfigTest);

    describe('client provider', () => {
        it('can load clients correctly', clientLoadTest);
        it('defaults grants on clients', clientGrantDefaultTest);
        it('handles no clients', clientLoadNoClients);
        it('handles an undefined glob result', clientLoadUndefinedResult);
        it('handles file errors', clientFileErrors);
        it('handles invalid JSON', clientInvalidJSON);
    });

    describe('scopes provider', () => {
        it('can load scopes correctly', scopeLoadTest);
        it('handles no scopes', scopeLoadNoScopes);
        it('handles an undefined glob result', scopeLoadUndefinedResult);
        it('handles file errors', scopeFileErrors);
        it('handles invalid JSON', scopeInvalidJSON);
    });

    describe('get banned passwords', () => {
        it('returns an empty list when an error occurs', getBannedPasswordsExceptionTest);
        it('handles invalid JSON in file', getBannedPasswordsInvalidJSON);
    });
});