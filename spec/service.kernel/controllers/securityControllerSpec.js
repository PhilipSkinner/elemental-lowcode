const
    sinon 			= require('sinon'),
    controller 		= require('../../../src/service.kernel/controllers/securityController');

const app = {
    get : () => {},
    post : () => {},
    put : () => {},
    delete : () => {}
};

const fileLister = {
    executeGlob : () => {},
    readJSONFile : () => {},
    readFile : () => {},
    writeFile : () => {},
    deleteFile : () => {},
};

const roleCheckHandler = {
    enforceRoles : () => {}
};

const path = {
    join : () => {}
};

const constructorTest = (done) => {
    const instance = controller(null, null, null, null, null, null, null);
    expect(instance.fileLister).not.toBe(null);
    expect(instance.roleCheckHandler).not.toBe(null);
    expect(instance.db).not.toBe(null);
    expect(instance.path).not.toBe(null);
    done();
};

/* CLIENTS */

const getClientsGlobExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('identity-dir', '**/*.client.json').returns('search-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('search-path').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.getClients({}, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oops'
                ]
            });
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const getClientsTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('identity-dir', '**/*.client.json').returns('search-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('search-path').returns(Promise.resolve([{
        name : 'this is my name.client'
    }]));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.getClients({}, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual([{
                name : 'this is my name.client',
                client_id : 'this is my name'
            }]);
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const getClientSingularReadErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('identity-dir', 'my-id.client.json').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.getClient({
        params : {
            id : 'my-id'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oops'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const getClientSingularTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('identity-dir', 'my-id.client.json').returns(Promise.resolve('some-content'));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.getClient({
        params : {
            id : 'my-id'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual('some-content');
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const updateClientFileWriteErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('identity-dir', 'my-id.client.json').returns(Promise.reject(new Error('really not good')));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.updateClient({
        body : {
            client_id : 'my-id'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: really not good'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const updateClientTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('identity-dir', 'my-id.client.json').returns(Promise.resolve());

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.updateClient({
        body : {
            client_id : 'my-id'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const deleteClientErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('identity-dir', 'my-id.client.json').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.deleteClient({
        params : {
            id : 'my-id'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oops'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const deleteClientTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('identity-dir', 'my-id.client.json').returns(Promise.resolve());

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.deleteClient({
        params : {
            id : 'my-id'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const createClientFileWriteErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('identity-dir', 'my-id.client.json').returns(Promise.reject(new Error('really not good')));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.createClient({
        body : {
            client_id : 'my-id'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: really not good'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const createClientTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('identity-dir', 'my-id.client.json').returns(Promise.resolve());

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.createClient({
        body : {
            client_id : 'my-id'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(201);
        },
        location : (value) => {
            expect(value).toEqual('/security/clients/my-id');
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

/* SCOPES */

const getScopesGlobExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('identity-dir', '**/*.scope.json').returns('search-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('search-path').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.getScopes({}, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oops'
                ]
            });
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const getScopesTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('identity-dir', '**/*.scope.json').returns('search-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('search-path').returns(Promise.resolve([{
        name : 'this is my name.scope'
    }]));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.getScopes({}, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual([{
                name : 'this is my name',
            }]);
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const getScopeSingularReadErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('identity-dir', 'my-name.scope.json').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.getScope({
        params : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oops'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const getScopeSingularTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('identity-dir', 'my-name.scope.json').returns(Promise.resolve('some-content'));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.getScope({
        params : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual('some-content');
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const updateScopeFileWriteErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('identity-dir', 'my-name.scope.json').returns(Promise.reject(new Error('really not good')));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.updateScope({
        body : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: really not good'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const updateScopeTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('identity-dir', 'my-name.scope.json').returns(Promise.resolve());

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.updateScope({
        body : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const deleteScopeErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('identity-dir', 'my-name.scope.json').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.deleteScope({
        params : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oops'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const deleteScopeTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('identity-dir', 'my-name.scope.json').returns(Promise.resolve());

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.deleteScope({
        params : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const createScopeFileWriteErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('identity-dir', 'my-name.scope.json').returns(Promise.reject(new Error('really not good')));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.createScope({
        body : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: really not good'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const createScopeTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('identity-dir', 'my-name.scope.json').returns(Promise.resolve());

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.createScope({
        body : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(201);
        },
        location : (value) => {
            expect(value).toEqual('/security/scopes/my-name');
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

/* MAIN CONFIG */

const getConfigExceptionTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('identity-dir', 'main.json').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.getConfig({}, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual({});
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const getConfigTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('identity-dir', 'main.json').returns(Promise.resolve('some-content'));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.getConfig({}, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual('some-content');
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const updateConfigFileWriteErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('identity-dir', 'main.json').returns(Promise.reject(new Error('really not good')));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.saveConfig({
        body : {
            hello : 'world'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: really not good'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const updateConfigTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('identity-dir', 'main.json').returns(Promise.resolve());

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.saveConfig({
        body : {
            hello : 'world'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

/* SECRETS */

const getSecretsGlobExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('secrets-dir', '**/*.secret.json').returns('search-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('search-path').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.getSecrets({}, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oops'
                ]
            });
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const getSecretsTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('secrets-dir', '**/*.secret.json').returns('search-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('search-path').returns(Promise.resolve([{
        basename : 'an secret'
    }]));
    fileMock.expects('readJSONFile').once().withArgs('secrets-dir', 'an secret').returns(Promise.resolve('the-secret'));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.getSecrets({}, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual([
                'the-secret'
            ]);
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const updateSecretFileWriteErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('secrets-store', 'my-name.secret.json').returns(Promise.reject(new Error('really not good')));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.setSecret({
        params : {
            name : 'my-name'
        },
        body : {
            hello : 'world'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: really not good'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const updateSecretTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('secrets-store', 'my-name.secret.json').returns(Promise.resolve());

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.setSecret({
        params : {
            name : 'my-name'
        },
        body : {
            hello : 'world'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const deleteSecretErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('secrets-dir', 'my-name.secret.json').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.deleteSecret({
        params : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oops'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const deleteSecretTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('secrets-dir', 'my-name.secret.json').returns(Promise.resolve());

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.deleteSecret({
        params : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const createSecretFileWriteErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('secrets-dir', 'my-name.secret.json').returns(Promise.reject(new Error('really not good')));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.createSecret({
        body : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: really not good'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const createSecretTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('secrets-dir', 'my-name.secret.json').returns(Promise.resolve());

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.createSecret({
        body : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(201);
        },
        location : (value) => {
            expect(value).toEqual('/security/secrets/my-name');
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

/*
 * Banned passwords
 */

const getBannedPasswordsExceptionTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('identity-dir', 'banned.passwords.json').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.getBannedPasswords({}, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual([]);
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const getBannedPasswordsTest = (done) => {
        const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('identity-dir', 'banned.passwords.json').returns(Promise.resolve([
        'hello world'
    ]));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.getBannedPasswords({}, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual([
                'hello world'
            ]);
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const updateBannedPasswordsExceptionTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('identity-dir', 'banned.passwords.json').returns(Promise.reject(new Error('really not good')));

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.updateBannedPasswords({
        body : {
            hello : 'world'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: really not good'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const updateBannedPasswordsTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('identity-dir', 'banned.passwords.json').returns(Promise.resolve());

    const instance = controller(app, 'identity-dir', 'secrets-dir', 'secrets-store', fileLister, roleCheckHandler, path);

    instance.updateBannedPasswords({
        body : {
            hello : 'world'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

describe('A security controller', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('clients', () => {
        describe('get', () => {
            it('handles glob exceptions', getClientsGlobExceptionTest);
            it('works', getClientsTest);
        });

        describe('get singular', () => {
            it('handles read errors', getClientSingularReadErrorTest);
            it('works', getClientSingularTest);
        });

        describe('update', () => {
            it('handles file write errors', updateClientFileWriteErrorTest);
            it('works', updateClientTest);
        });

        describe('delete', () => {
            it('handles deletion errors', deleteClientErrorTest);
            it('works', deleteClientTest);
        });

        describe('create', () => {
            it('handles file write errors', createClientFileWriteErrorTest);
            it('works', createClientTest);
        });
    });

    describe('scopes', () => {
        describe('get', () => {
            it('handles glob exceptions', getScopesGlobExceptionTest);
            it('works', getScopesTest);
        });

        describe('get singular', () => {
            it('handles read errors', getScopeSingularReadErrorTest);
            it('works', getScopeSingularTest);
        });

        describe('update', () => {
            it('handles file write errors', updateScopeFileWriteErrorTest);
            it('works', updateScopeTest);
        });

        describe('delete', () => {
            it('handles deletion errors', deleteScopeErrorTest);
            it('works', deleteScopeTest);
        });

        describe('create', () => {
            it('handles file write errors', createScopeFileWriteErrorTest);
            it('works', createScopeTest);
        });
    });

    describe('main config', () => {
        describe('get', () => {
            it('handles exceptions', getConfigExceptionTest);
            it('works', getConfigTest);
        });

        describe('update', () => {
            it('handles file write errors', updateConfigFileWriteErrorTest);
            it('works', updateConfigTest);
        });
    });

    describe('secrets', () => {
        describe('get', () => {
            it('handles glob exceptions', getSecretsGlobExceptionTest);
            it('works', getSecretsTest);
        });

        describe('update', () => {
            it('handles file write errors', updateSecretFileWriteErrorTest);
            it('works', updateSecretTest);
        });

        describe('delete', () => {
            it('handles deletion errors', deleteSecretErrorTest);
            it('works', deleteSecretTest);
        });

        describe('create', () => {
            it('handles file write errors', createSecretFileWriteErrorTest);
            it('works', createSecretTest);
        });
    });

    describe('banned passwords', () => {
        describe('get', () => {
            it('handles file exceptions', getBannedPasswordsExceptionTest);
            it('works', getBannedPasswordsTest);
        });

        describe('put', () => {
            it('handles file write errors', updateBannedPasswordsExceptionTest);
            it('works', updateBannedPasswordsTest);
        });
    });
});