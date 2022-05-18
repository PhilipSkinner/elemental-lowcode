const
    sinon = require('sinon'),
    queueInstance = require('../../../src/service.messaging/lib/queueInstance');

const app = {
    get : () => {},
    post : () => {},
    delete : () => {}
};

const roleCheckHandler = {
    enforceRoles : () => {}
};

const sqlQueueProvider = {
    main : () => {},
    insertMessage : () => {},
    getMessage : () => {},
    deleteMessage : () => {},
    getNextMessage : () => {},
    markAsInProgress : () => {},
    markAsComplete : () => {},
    markAsError : () => {},
};

const uuid = {
    v4 : () => {}
};

const serviceProvider = {

};

const storageService = {

};

const integrationService = {

};

const rulesetService = {

};

const idmService = {

};

const authClientProvider = {

};

const messagingService = {

};

const ajv = {
    compile : () => {}
};

const environmentService = {
    listSecrets : () => {}
};

const dataResolver = {
    detectValues : () => {}
};

const constructorTest = (done) => {
    const instance = queueInstance();

    expect(instance.roleCheckHandler).not.toBe(null);
    expect(instance.queueProvider).not.toBe(null);
    expect(instance.uuid).not.toBe(null);
    expect(instance.hostnameResolver).not.toBe(null);
    expect(instance.serviceProvider).not.toBe(null);
    expect(instance.storageService).not.toBe(null);
    expect(instance.integrationService).not.toBe(null);
    expect(instance.rulesetService).not.toBe(null);
    expect(instance.idmService).not.toBe(null);
    expect(instance.authClientProvider).not.toBe(null);
    expect(instance.messagingService).not.toBe(null);
    expect(instance.ajv).not.toBe(null);

    done();
};

const sqlNullConnectionStringTest = (done) => {
    const environmentServiceMock = sinon.mock(environmentService);
    environmentServiceMock.expects('listSecrets').once().returns('some-secrets');

    const dataResolverMock = sinon.mock(dataResolver);
    dataResolverMock.expects('detectValues').once().withArgs('original-connection-string', {
        secrets : 'some-secrets'
    }, {}, true).returns('');

    const instance = queueInstance(
        app, {
            storageEngine : 'sql',
            connectionString : 'original-connection-string'
        },
        roleCheckHandler, sqlQueueProvider.main, uuid,
        serviceProvider, storageService, integrationService, rulesetService, idmService,
        authClientProvider, messagingService, ajv, environmentService, dataResolver
    );

    environmentServiceMock.verify();
    dataResolverMock.verify();

    done();
};

const queueMessageInvalidBodyTest = (done) => {
    const validator = function() {
        validator.errors = 'some-errors';
        return false;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(validator);

    const instance = queueInstance(
        app, {
            incoming : {
                schema : 'my-schema'
            }
        },
        roleCheckHandler, sqlQueueProvider.main, uuid,
        serviceProvider, storageService, integrationService, rulesetService, idmService,
        authClientProvider, messagingService, ajv, environmentService, dataResolver
    );

    const res = {
        status : (code) => {
            expect(code).toEqual(422);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : 'some-errors'
            });
        },
        end : () => {
            ajvMock.verify();
            done();
        }
    };

    instance.queueMessage({
        body : 'the-body'
    }, res);
};

const queueMessageInsertionError = (done) => {
    const validator = function() {
        return true;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(validator);

    const uuidMock = sinon.mock(uuid);
    uuidMock.expects('v4').once().returns('my-id');

    const sqlProviderMock = sinon.mock(sqlQueueProvider);
    sqlProviderMock.expects('main').once().returns(sqlQueueProvider);
    sqlProviderMock.expects('insertMessage').once().withArgs('queue-name', 'my-id', {
        id      : 'my-id',
        queue   : 'queue-name',
        status  : 'PENDING',
        request : 'the-body',
        result  : null,
        error   : null
    }).returns(Promise.reject(new Error('oh noes')));

    const instance = queueInstance(
        app, {
            name : 'queue-name',
            incoming : {
                schema : 'my-schema'
            }
        },
        roleCheckHandler, sqlQueueProvider.main, uuid,
        serviceProvider, storageService, integrationService, rulesetService, idmService,
        authClientProvider, messagingService, ajv, environmentService, dataResolver
    );

    const res = {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oh noes'
                ]
            });
        },
        end : () => {
            ajvMock.verify();
            uuidMock.verify();
            sqlProviderMock.verify();
            done();
        }
    };

    instance.queueMessage({
        body : 'the-body'
    }, res);
};

const queueMessageTest = (done) => {
    const validator = function() {
        return true;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(validator);

    const uuidMock = sinon.mock(uuid);
    uuidMock.expects('v4').once().returns('my-id');

    const sqlProviderMock = sinon.mock(sqlQueueProvider);
    sqlProviderMock.expects('main').once().returns(sqlQueueProvider);
    sqlProviderMock.expects('insertMessage').once().withArgs('queue-name', 'my-id', {
        id      : 'my-id',
        queue   : 'queue-name',
        status  : 'PENDING',
        request : 'the-body',
        result  : null,
        error   : null
    }).returns(Promise.resolve());

    const instance = queueInstance(
        app, {
            name : 'queue-name',
            incoming : {
                schema : 'my-schema'
            }
        },
        roleCheckHandler, sqlQueueProvider.main, uuid,
        serviceProvider, storageService, integrationService, rulesetService, idmService,
        authClientProvider, messagingService, ajv, environmentService, dataResolver
    );

    const res = {
        status : (code) => {
            expect(code).toEqual(201);
        },
        location : (value) => {
            expect(value).toEqual('/queue-name/my-id');
        },
        end : () => {
            ajvMock.verify();
            uuidMock.verify();
            sqlProviderMock.verify();
            done();
        }
    };

    instance.queueMessage({
        body : 'the-body'
    }, res);
};

const getMessageErrorTest = (done) => {
    const sqlProviderMock = sinon.mock(sqlQueueProvider);
    sqlProviderMock.expects('main').once().returns(sqlQueueProvider);
    sqlProviderMock.expects('getMessage').once().withArgs('queue-name', 'my-id').returns(Promise.reject('not found'));

    const instance = queueInstance(
        app, {
            name : 'queue-name',
            incoming : {
                schema : 'my-schema'
            }
        },
        roleCheckHandler, sqlQueueProvider.main, uuid,
        serviceProvider, storageService, integrationService, rulesetService, idmService,
        authClientProvider, messagingService, ajv, environmentService, dataResolver
    );

    const res = {
        status : (code) => {
            expect(code).toEqual(404);
        },
        end : () => {
            sqlProviderMock.verify();
            done();
        }
    };

    instance.getMessage({
        params : {
            id : 'my-id'
        }
    }, res);
};

const getMessageNotFoundTest = (done) => {
    const sqlProviderMock = sinon.mock(sqlQueueProvider);
    sqlProviderMock.expects('main').once().returns(sqlQueueProvider);
    sqlProviderMock.expects('getMessage').once().withArgs('queue-name', 'my-id').returns(Promise.resolve(null));

    const instance = queueInstance(
        app, {
            name : 'queue-name',
            incoming : {
                schema : 'my-schema'
            }
        },
        roleCheckHandler, sqlQueueProvider.main, uuid,
        serviceProvider, storageService, integrationService, rulesetService, idmService,
        authClientProvider, messagingService, ajv, environmentService, dataResolver
    );

    const res = {
        status : (code) => {
            expect(code).toEqual(404);
        },
        end : () => {
            sqlProviderMock.verify();
            done();
        }
    };

    instance.getMessage({
        params : {
            id : 'my-id'
        }
    }, res);
};

const getMessageTest = (done) => {
    const sqlProviderMock = sinon.mock(sqlQueueProvider);
    sqlProviderMock.expects('main').once().returns(sqlQueueProvider);
    sqlProviderMock.expects('getMessage').once().withArgs('queue-name', 'my-id').returns(Promise.resolve('the-message'));

    const instance = queueInstance(
        app, {
            name : 'queue-name',
            incoming : {
                schema : 'my-schema'
            }
        },
        roleCheckHandler, sqlQueueProvider.main, uuid,
        serviceProvider, storageService, integrationService, rulesetService, idmService,
        authClientProvider, messagingService, ajv, environmentService, dataResolver
    );

    const res = {
        json : (data) => {
            expect(data).toEqual('the-message');
        },
        status : (code) => {
            expect(code).toEqual(200);
        },
        end : () => {
            sqlProviderMock.verify();
            done();
        }
    };

    instance.getMessage({
        params : {
            id : 'my-id'
        }
    }, res);
};

const deleteMessageErrorTest = (done) => {
    const sqlProviderMock = sinon.mock(sqlQueueProvider);
    sqlProviderMock.expects('main').once().returns(sqlQueueProvider);
    sqlProviderMock.expects('deleteMessage').once().withArgs('queue-name', 'my-id').returns(Promise.reject());

    const instance = queueInstance(
        app, {
            name : 'queue-name',
            incoming : {
                schema : 'my-schema'
            }
        },
        roleCheckHandler, sqlQueueProvider.main, uuid,
        serviceProvider, storageService, integrationService, rulesetService, idmService,
        authClientProvider, messagingService, ajv, environmentService, dataResolver
    );

    const res = {
        status : (code) => {
            expect(code).toEqual(404);
        },
        end : () => {
            sqlProviderMock.verify();
            done();
        }
    };

    instance.deleteMessage({
        params : {
            id : 'my-id'
        }
    }, res);
};

const deleteMessageTest = (done) => {
    const sqlProviderMock = sinon.mock(sqlQueueProvider);
    sqlProviderMock.expects('main').once().returns(sqlQueueProvider);
    sqlProviderMock.expects('deleteMessage').once().withArgs('queue-name', 'my-id').returns(Promise.resolve());

    const instance = queueInstance(
        app, {
            name : 'queue-name',
            incoming : {
                schema : 'my-schema'
            }
        },
        roleCheckHandler, sqlQueueProvider.main, uuid,
        serviceProvider, storageService, integrationService, rulesetService, idmService,
        authClientProvider, messagingService, ajv, environmentService, dataResolver
    );

    const res = {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            sqlProviderMock.verify();
            done();
        }
    };

    instance.deleteMessage({
        params : {
            id : 'my-id'
        }
    }, res);
};

const setupMissingName = (done) => {
    const instance = queueInstance(
        app, {
            incoming : {
                schema : 'my-schema'
            },
            roles : {
                replace : false
            }
        },
        roleCheckHandler, sqlQueueProvider.main, uuid,
        serviceProvider, storageService, integrationService, rulesetService, idmService,
        authClientProvider, messagingService, ajv, environmentService, dataResolver
    );

    instance.setupEndpoints().then(() => {
        done();
    });
};

const setupDefaultRolesTest = (done) => {
    const roleHandlerMock = sinon.mock(roleCheckHandler);
    roleHandlerMock.expects('enforceRoles').exactly(3).withArgs(sinon.match.any, [
        'system_admin',
        'system_writer',
        'queue_writer',
        'queue-name_writer'
    ]).returns('roles');

    const appMock = sinon.mock(app);
    appMock.expects('post').once().withArgs('/queue-name', 'roles');
    appMock.expects('get').once().withArgs('/queue-name/:id', 'roles');
    appMock.expects('delete').once().withArgs('/queue-name/:id', 'roles');

    const instance = queueInstance(
        app, {
            name : 'queue-name',
            incoming : {
                schema : 'my-schema'
            },
            roles : {
                replace : false
            }
        },
        roleCheckHandler, sqlQueueProvider.main, uuid,
        serviceProvider, storageService, integrationService, rulesetService, idmService,
        authClientProvider, messagingService, ajv, environmentService, dataResolver
    );

    instance.setupEndpoints().then(() => {
        roleHandlerMock.verify();
        appMock.verify();

        done();
    });
};

const setupRoleReplaceTest = (done) => {
    const roleHandlerMock = sinon.mock(roleCheckHandler);
    roleHandlerMock.expects('enforceRoles').exactly(3).withArgs(sinon.match.any, ['system_admin']).returns('roles');

    const appMock = sinon.mock(app);
    appMock.expects('post').once().withArgs('/queue-name', 'roles');
    appMock.expects('get').once().withArgs('/queue-name/:id', 'roles');
    appMock.expects('delete').once().withArgs('/queue-name/:id', 'roles');

    const instance = queueInstance(
        app, {
            name : 'queue-name',
            incoming : {
                schema : 'my-schema'
            },
            roles : {
                replace : true
            }
        },
        roleCheckHandler, sqlQueueProvider.main, uuid,
        serviceProvider, storageService, integrationService, rulesetService, idmService,
        authClientProvider, messagingService, ajv, environmentService, dataResolver
    );

    instance.setupEndpoints().then(() => {
        roleHandlerMock.verify();
        appMock.verify();

        done();
    });
};

const setupCustomRolesTest = (done) => {
    const roleHandlerMock = sinon.mock(roleCheckHandler);
    roleHandlerMock.expects('enforceRoles').exactly(3).withArgs(sinon.match.any, ['system_admin', 'my-role']).returns('roles');

    const appMock = sinon.mock(app);
    appMock.expects('post').once().withArgs('/queue-name', 'roles');
    appMock.expects('get').once().withArgs('/queue-name/:id', 'roles');
    appMock.expects('delete').once().withArgs('/queue-name/:id', 'roles');

    const instance = queueInstance(
        app, {
            name : 'queue-name',
            incoming : {
                schema : 'my-schema'
            },
            roles : {
                replace : true,
                roles : ['my-role']
            }
        },
        roleCheckHandler, sqlQueueProvider.main, uuid,
        serviceProvider, storageService, integrationService, rulesetService, idmService,
        authClientProvider, messagingService, ajv, environmentService, dataResolver
    );

    instance.setupEndpoints().then(() => {
        roleHandlerMock.verify();
        appMock.verify();

        done();
    });
};

const setupNoRolesTest = (done) => {
    const roleHandlerMock = sinon.mock(roleCheckHandler);
    roleHandlerMock.expects('enforceRoles').exactly(3).withArgs(sinon.match.any, null).returns('roles');

    const appMock = sinon.mock(app);
    appMock.expects('post').once().withArgs('/queue-name', 'roles');
    appMock.expects('get').once().withArgs('/queue-name/:id', 'roles');
    appMock.expects('delete').once().withArgs('/queue-name/:id', 'roles');

    const instance = queueInstance(
        app, {
            name : 'queue-name',
            incoming : {
                schema : 'my-schema'
            },
            roles : {
                needsRole : false
            }
        },
        roleCheckHandler, sqlQueueProvider.main, uuid,
        serviceProvider, storageService, integrationService, rulesetService, idmService,
        authClientProvider, messagingService, ajv, environmentService, dataResolver
    );

    instance.setupEndpoints().then(() => {
        roleHandlerMock.verify();
        appMock.verify();

        done();
    });
};

const terminateTest = (done) => {
    const instance = queueInstance(
        app, {
            name : 'queue-name',
            incoming : {
                schema : 'my-schema'
            },
            roles : {
                needsRole : false
            }
        },
        roleCheckHandler, sqlQueueProvider.main, uuid,
        serviceProvider, storageService, integrationService, rulesetService, idmService,
        authClientProvider, messagingService, ajv, environmentService, dataResolver
    );

    instance.timeout = setTimeout(() => { throw new Error('bad times'); }, 1);

    instance.terminate();

    expect(instance.timeout._destroyed).toBe(true);

    done();
};

const handlerMissingName = (done) => {
    const instance = queueInstance(
        app, {
            incoming : {
                schema : 'my-schema'
            },
            roles : {
                needsRole : false
            }
        },
        roleCheckHandler, sqlQueueProvider.main, uuid,
        serviceProvider, storageService, integrationService, rulesetService, idmService,
        authClientProvider, messagingService, ajv, environmentService, dataResolver
    );

    instance.setupHandler();

    done();
};

const handlerPauseTest = (done) => {
    const sqlProviderMock = sinon.mock(sqlQueueProvider);
    sqlProviderMock.expects('main').once().returns(sqlQueueProvider);
    sqlProviderMock.expects('getNextMessage').once().withArgs('queue-name').returns(Promise.resolve(null));

    const instance = queueInstance(
        app, {
            name : 'queue-name',
            incoming : {
                schema : 'my-schema'
            },
            roles : {
                needsRole : false
            }
        },
        roleCheckHandler, sqlQueueProvider.main, uuid,
        serviceProvider, storageService, integrationService, rulesetService, idmService,
        authClientProvider, messagingService, ajv, environmentService, dataResolver
    );

    instance.setupHandler();

    setTimeout(() => {
        expect(instance.timeout._idleTimeout).toEqual(2500);

        sqlProviderMock.verify();

        instance.terminate();

        done();
    }, 1);
};

const handlerResultTest = (done) => {
    const sqlProviderMock = sinon.mock(sqlQueueProvider);
    sqlProviderMock.expects('main').once().returns(sqlQueueProvider);
    sqlProviderMock.expects('getNextMessage').once().withArgs('queue-name').returns(Promise.resolve({
        id : 'my-id',
        request : 'the-request'
    }));
    sqlProviderMock.expects('markAsInProgress').once().withArgs('queue-name').returns(Promise.resolve());
    sqlProviderMock.expects('markAsComplete').once().withArgs('queue-name', 'my-id', 'all good').returns(Promise.resolve());

    const instance = queueInstance(
        app, {
            handler : (messages) => {
                expect(messages).toEqual('the-request');

                return Promise.resolve('all good');
            },
            name : 'queue-name',
            incoming : {
                schema : 'my-schema'
            },
            roles : {
                needsRole : false
            }
        },
        roleCheckHandler, sqlQueueProvider.main, uuid,
        serviceProvider, storageService, integrationService, rulesetService, idmService,
        authClientProvider, messagingService, ajv, environmentService, dataResolver
    );

    instance.setupHandler();

    setImmediate(() => {
        sqlProviderMock.verify();

        instance.terminate();

        done();
    });
};

const handlerErrorTest = (done) => {
    const sqlProviderMock = sinon.mock(sqlQueueProvider);
    sqlProviderMock.expects('main').once().returns(sqlQueueProvider);
    sqlProviderMock.expects('getNextMessage').once().withArgs('queue-name').returns(Promise.resolve({
        id : 'my-id',
        request : 'the-request'
    }));
    sqlProviderMock.expects('markAsInProgress').once().withArgs('queue-name').returns(Promise.resolve());
    sqlProviderMock.expects('markAsError').once().withArgs('queue-name', 'my-id', 'all bad').returns(Promise.resolve());

    const instance = queueInstance(
        app, {
            handler : (messages) => {
                expect(messages).toEqual('the-request');

                return Promise.reject('all bad');
            },
            name : 'queue-name',
            incoming : {
                schema : 'my-schema'
            },
            roles : {
                needsRole : false
            }
        },
        roleCheckHandler, sqlQueueProvider.main, uuid,
        serviceProvider, storageService, integrationService, rulesetService, idmService,
        authClientProvider, messagingService, ajv, environmentService, dataResolver
    );

    instance.setupHandler();

    setImmediate(() => {
        sqlProviderMock.verify();

        instance.terminate();

        done();
    });
};

describe('A messaging queue instance', () => {
    it('handles constructor defaulting', constructorTest);
    it('defaults to sql provider with null connection string', sqlNullConnectionStringTest);

    describe('queue message', () => {
        it('handles invalid bodies', queueMessageInvalidBodyTest);
        it('handles insertion errors', queueMessageInsertionError);
        it('correctly queues messages', queueMessageTest);
    });

    describe('get message', () => {
        it('handles error fetching messages', getMessageErrorTest);
        it('handles null responses', getMessageNotFoundTest);
        it('works', getMessageTest);
    });

    describe('delete message', () => {
        it('handles error deleting message', deleteMessageErrorTest);
        it('works', deleteMessageTest);
    });

    describe('setup endpoints', () => {
        it('handles missing definition name', setupMissingName);
        it('with default roles', setupDefaultRolesTest);
        it('allows roles to be replaced', setupRoleReplaceTest);
        it('allows custom roles', setupCustomRolesTest);
        it('allows no roles', setupNoRolesTest);
    });

    it('can terminate the handler', terminateTest);

    describe('setup handler', () => {
        it('handles missing definition name', handlerMissingName);
        it('pauses when there are no messages', handlerPauseTest);
        it('handles messages with results', handlerResultTest);
        it('handles messages with errors', handlerErrorTest);
    });
});