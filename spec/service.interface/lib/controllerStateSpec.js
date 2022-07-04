const
    jasmine 		= require('jasmine'),
    sinon 			= require('sinon'),
    controllerState = require('../../../src/service.interface/lib/controllerState');

const storageService = {
    setAuthClientProvider : () => {}
};
const sessionState = {
    setContext : () => {},
    setAuthClientProvider : () => {},
    generateResponseHeaders : () => {},
    deallocate : () => {}
};
const integrationService = {
    setAuthClientProvider : () => {}
};
const rulesetService = {
    setAuthClientProvider : () => {}
};
const authClientProvider = {
    setSessionState : () => {},
    setAuthClientProvider : () => {},
    setNavigationService : () => {},
};
const idmService = {
    setAuthClientProvider : () => {}
};
const navigationService = {
    setContext : () => {},
    setAuthClientProvider : () => {},
    generateResponseHeaders : () => {}
};
const serviceProvider = {
    setContext : () => {},
    setAuthClientProvider : () => {}
};
const messagingService = {
    setAuthClientProvider : () => {}
};
const environmentService = {
    setAuthClientProvider : () => {}
};
const locationService = {
    setAuthClientProvider : () => {}
};

const constructorTest = (done) => {
    const state = {};
    const instance = controllerState(state);

    expect(state.storageService).not.toBe(undefined);
    expect(state.sessionState).not.toBe(undefined);
    expect(state.integrationService).not.toBe(undefined);
    expect(state.rulesetService).not.toBe(undefined);
    expect(state.authClientProvider).not.toBe(undefined);
    expect(state.idmService).not.toBe(undefined);
    expect(state.navigationService).not.toBe(undefined);
    expect(state.serviceProvider).not.toBe(undefined);
    expect(state.messagingService).not.toBe(undefined);
    expect(state.environmentService).not.toBe(undefined);
    expect(state.mergeBag).not.toBe(undefined);
    expect(state.locationService).not.toBe(undefined);

    done();
};

const mergeNullBagTest = (done) => {
    const state = {};
    const instance = controllerState(state);

    instance.mergeBag(null);

    expect(state.bag).toEqual({});

    done();
};

const mergeNoneNullBagTest = (done) => {
    const state = {
        bag : {
            hello : 'world',
            doot : 'woot'
        }
    };
    const instance = controllerState(state);

    instance.mergeBag({
        hello : 'there',
        general : 'kenobi'
    });

    expect(state.bag).toEqual({
        hello : 'there',
        general : 'kenobi',
        doot : 'woot'
    });

    done();
};

const setContextTest = (done) => {
    const state = {};
    const instance = controllerState(state, {}, storageService, sessionState, integrationService, rulesetService, authClientProvider, idmService, navigationService, serviceProvider, messagingService, environmentService, locationService);

    const sessionStateMock = sinon.mock(sessionState);
    sessionStateMock.expects('setContext').once().withArgs('request', 'response');

    const navigationServiceMock = sinon.mock(navigationService);
    navigationServiceMock.expects('setContext').once().withArgs('request', 'response');

    const authClientProviderMock = sinon.mock(authClientProvider);
    authClientProviderMock.expects('setSessionState').once().withArgs(sinon.match.any);
    authClientProviderMock.expects('setNavigationService').once().withArgs(sinon.match.any);

    const serviceProviderMock = sinon.mock(serviceProvider);
    serviceProviderMock.expects('setContext').once().withArgs(sinon.match.any, 'request', 'response', sinon.match.any);

    instance.setContext('request', 'response');

    sessionStateMock.verify();    
    navigationServiceMock.verify();
    authClientProviderMock.verify();
    serviceProviderMock.verify();

    done();
};

const setContextHeadersTest = (done) => {
    const request = {
        headers : {
            'x-forwarded-for'   : 'my-ip',
            'user-agent'             : 'my-agent'
        }
    };
    const state = {};
    const instance = controllerState(state, {}, storageService, sessionState, integrationService, rulesetService, authClientProvider, idmService, navigationService, serviceProvider, messagingService, environmentService);

    const sessionStateMock = sinon.mock(sessionState);
    sessionStateMock.expects('setContext').once().withArgs(request, 'response');

    const navigationServiceMock = sinon.mock(navigationService);
    navigationServiceMock.expects('setContext').once().withArgs(request, 'response');

    const authClientProviderMock = sinon.mock(authClientProvider);
    authClientProviderMock.expects('setSessionState').once().withArgs(sinon.match.any);
    authClientProviderMock.expects('setNavigationService').once().withArgs(sinon.match.any);

    const serviceProviderMock = sinon.mock(serviceProvider);
    serviceProviderMock.expects('setContext').once().withArgs(sinon.match.any, request, 'response', sinon.match.any);

    instance.setContext(request, 'response');

    expect(instance.controllerDefinition.context).toEqual({
        client : {
            ip : 'my-ip',
            agent : 'my-agent'
        }
    });

    sessionStateMock.verify();
    navigationServiceMock.verify();
    authClientProviderMock.verify();
    serviceProviderMock.verify();

    done();
};

const setContextRemoteSocket = (done) => {
    const request = {
        socket : {
            remoteAddress : 'my-ip'
        },
        headers : {
            'user-agent'             : 'my-agent'
        }
    };
    const state = {};
    const instance = controllerState(state, {}, storageService, sessionState, integrationService, rulesetService, authClientProvider, idmService, navigationService, serviceProvider, messagingService, environmentService);

    const sessionStateMock = sinon.mock(sessionState);
    sessionStateMock.expects('setContext').once().withArgs(request, 'response');

    const navigationServiceMock = sinon.mock(navigationService);
    navigationServiceMock.expects('setContext').once().withArgs(request, 'response');

    const authClientProviderMock = sinon.mock(authClientProvider);
    authClientProviderMock.expects('setSessionState').once().withArgs(sinon.match.any);
    authClientProviderMock.expects('setNavigationService').once().withArgs(sinon.match.any);

    const serviceProviderMock = sinon.mock(serviceProvider);
    serviceProviderMock.expects('setContext').once().withArgs(sinon.match.any, request, 'response', sinon.match.any);

    instance.setContext(request, 'response');

    expect(instance.controllerDefinition.context).toEqual({
        client : {
            ip : 'my-ip',
            agent : 'my-agent'
        }
    });

    sessionStateMock.verify();
    navigationServiceMock.verify();
    authClientProviderMock.verify();
    serviceProviderMock.verify();

    done();
};

const setComponentsTest = (done) => {
    const state = {};
    const instance = controllerState(state);

    instance.setComponents('my components');

    expect(instance.componentInstances).toEqual('my components');

    done();
};

const generateResponseHeadersUndefinedMethods = (done) => {
    const state = {};
    const instance = controllerState(state, {}, storageService, "woot", integrationService, rulesetService, authClientProvider, idmService, "doot", serviceProvider, messagingService, environmentService);

    instance.generateResponseHeaders();

    done();
};

const generateResponseHeaders = (done) => {
    const state = {};
    const instance = controllerState(state, {}, storageService, sessionState, integrationService, rulesetService, authClientProvider, idmService, navigationService, serviceProvider, messagingService, environmentService);

    const sessionStateMock = sinon.mock(sessionState);
    sessionStateMock.expects('generateResponseHeaders').once();

    const navigationServiceMock = sinon.mock(navigationService);
    navigationServiceMock.expects('generateResponseHeaders').once();

    instance.generateResponseHeaders();

    sessionStateMock.verify();
    navigationServiceMock.verify();

    done();
};

const deallocateUndefinedMethods = (done) => {
    const state = {};
    const instance = controllerState(state, {}, storageService, "woot", integrationService, rulesetService, authClientProvider, idmService, navigationService, serviceProvider, messagingService, environmentService);

    instance.deallocate();

    done();
};

const deallocateTest = (done) => {
    const state = {};
    const instance = controllerState(state, {}, storageService, sessionState, integrationService, rulesetService, authClientProvider, idmService, navigationService, serviceProvider, messagingService, environmentService);

    const sessionStateMock = sinon.mock(sessionState);
    sessionStateMock.expects('deallocate').once();

    instance.deallocate();

    sessionStateMock.verify();

    expect(instance.controllerDefinition).toBe(null);
    expect(instance.request).toBe(null);
    expect(instance.response).toBe(null);

    done();
};

const getBagNullBag = (done) => {
    const state = {
        bag : null
    };
    const instance = controllerState(state, {}, storageService, sessionState, integrationService, rulesetService, authClientProvider, idmService, navigationService, serviceProvider, messagingService, environmentService);
    
    expect(instance.getBag()).toEqual({});    

    done();
};

const getBagValidBag = (done) => {
    const state = {
        bag : 'my bag'
    };
    const instance = controllerState(state, {}, storageService, sessionState, integrationService, rulesetService, authClientProvider, idmService, navigationService, serviceProvider, messagingService, environmentService);
    
    expect(instance.getBag()).toEqual('my bag');    

    done();
};

const cleanValuesTest = (done) => {
    const state = {};
    const instance = controllerState(state);

    expect(instance.cleanValues({
        arr : [
            '$(',
            '$.'
        ],
        hello : '$(world) $(another)',
        dots : '$.also $.work',
        ignore : true
    })).toEqual({
        arr : [
            '&#36;(',
            '&#36;.'
        ],
        hello : '&#36;(world) &#36;(another)',
        dots : '&#36;.also &#36;.work',
        ignore : true
    });

    done();
};

const triggerEventComponentExceptionTest = (done) => {
    const state = {
        events : {}
    };
    const instance = controllerState(state, {}, storageService, sessionState, integrationService, rulesetService, authClientProvider, idmService, navigationService, serviceProvider, messagingService, environmentService);

    instance.setComponents([
        {
            identifier : 'yes',
            instance : {
                events : {
                    woot : () => {
                        throw new Error('oh noes');
                    }
                }            
            }            
        }
    ]);

    instance.triggerEvent('woot', {
        _identifier : 'yes'
    }).catch((err) => {
        expect(err).toEqual(new Error('oh noes'));

        done();
    });    
};

const triggerEventPromiseExceptionTest = (done) => {
    const state = {
        events : {}
    };
    const instance = controllerState(state, {}, storageService, sessionState, integrationService, rulesetService, authClientProvider, idmService, navigationService, serviceProvider, messagingService, environmentService);

    instance.setComponents([
        {
            identifier : 'yes',
            instance : {
                events : {
                    woot : () => {
                        return Promise.reject(new Error('oh noes'));
                    }
                }            
            }            
        }
    ]);

    instance.triggerEvent('woot', {
        _identifier : 'yes'
    }).catch((err) => {
        expect(err).toEqual(new Error('oh noes'));

        done();
    });    
};

const triggerEventComponentNotPromise = (done) => {
    const state = {
        events : {}
    };
    const instance = controllerState(state, {}, storageService, sessionState, integrationService, rulesetService, authClientProvider, idmService, navigationService, serviceProvider, messagingService, environmentService);

    instance.setComponents([
        {
            identifier : 'yes',
            instance : {
                events : {
                    woot : () => {
                        return 'hello world';
                    }
                }            
            }            
        }
    ]);

    instance.triggerEvent('woot', {
        _identifier : 'yes'
    }).then(() => {        
        done();
    });    
};

const triggerEventsLoadOnAllComponents = (done) => {
    const state = {
        events : {}
    };
    const instance = controllerState(state, {}, storageService, sessionState, integrationService, rulesetService, authClientProvider, idmService, navigationService, serviceProvider, messagingService, environmentService);

    instance.setComponents([
        {
            identifier : 'yes',
            instance : {
                events : {
                    load : () => {
                        return 'hello world';
                    }
                }            
            }            
        },
        {
            identifier : 'yes',
            instance : {
                events : {
                    load : () => {
                        return Promise.resolve('hello world');
                    }
                }            
            }            
        }
    ]);

    instance.triggerEvent('load', {

    }).then(() => {        
        done();
    });    
};

const triggerEventIgnoreComponentWithoutEvent = (done) => {
    const state = {
        events : {}
    };
    const instance = controllerState(state, {}, storageService, sessionState, integrationService, rulesetService, authClientProvider, idmService, navigationService, serviceProvider, messagingService, environmentService);

    instance.setComponents([
        {
            identifier : 'yes',
            instance : {
                events : {
                    woot : () => {
                        throw new Error('oh noes');
                    }
                }            
            }            
        }
    ]);

    instance.triggerEvent('notwoot', {
        _identifier : 'yes'
    }).then(() => {        
        done();
    });    
};

const triggerEventIgnoreComponents = (done) => {
    const state = {
        events : {}
    };
    const instance = controllerState(state, {}, storageService, sessionState, integrationService, rulesetService, authClientProvider, idmService, navigationService, serviceProvider, messagingService, environmentService);

    instance.setComponents([
        {
            identifier : 'notyet',
            instance : {
                events : {
                    woot : () => {
                        throw new Error('oh noes');
                    }
                }            
            }            
        }
    ]);

    instance.triggerEvent('woot', {
        _identifier : 'yes'
    }).then(() => {        
        done();
    });    
};

const triggerEventExceptionTest = (done) => {
    const state = {
        events : {
            woot : () => {
                throw new Error('oh noes');
            }
        }
    };
    const instance = controllerState(state, {}, storageService, sessionState, integrationService, rulesetService, authClientProvider, idmService, navigationService, serviceProvider, messagingService, environmentService);
    
    instance.triggerEvent('woot', {
        _identifier : 'yes'
    }).catch((err) => {        
        expect(err).toEqual(new Error('oh noes'));

        done();
    });    
};

const triggerEventTest = (done) => {
    const state = {
        events : {
            woot : () => {
                return Promise.resolve('hello');
            }
        }
    };
    const instance = controllerState(state, {}, storageService, sessionState, integrationService, rulesetService, authClientProvider, idmService, navigationService, serviceProvider, messagingService, environmentService);
    
    instance.triggerEvent('woot', {
        _identifier : 'yes'
    }).then((res) => {        
        expect(res).toEqual('hello');

        done();
    });    
};

const triggerEventTestNotPromise = (done) => {
    const state = {
        events : {
            woot : () => {
                return 'hello';
            }
        }
    };
    const instance = controllerState(state, {}, storageService, sessionState, integrationService, rulesetService, authClientProvider, idmService, navigationService, serviceProvider, messagingService, environmentService);
    
    instance.triggerEvent('woot', {
        _identifier : 'yes'
    }).then((res) => {        
        expect(res).toEqual('hello');

        done();
    });    
};

describe('A controller state provider', () => {
    it('handles constructor defaults', constructorTest);

    describe('merges bags', () => {
        it('supporting null bags', mergeNullBagTest);
        it('supporting none null bags', mergeNoneNullBagTest);
    });

    describe('can set context', () => {
        it('correctly', setContextTest);
        it('can set context from headers', setContextHeadersTest);
        it('can set IP from remote socket', setContextRemoteSocket);
    });

    describe('can set components', () => {
        it('correctly', setComponentsTest);
    });

    describe('can generate response headers', () => {        
        it('with undefined methods', generateResponseHeadersUndefinedMethods);
        it('correctly', generateResponseHeaders);
    });

    describe('can deallocate resources', () => {
        it('with undefined methods', deallocateUndefinedMethods);
        it('correctly', deallocateTest);
    });

    describe('can get bag', () => {
        it('handling null bag', getBagNullBag);
        it('with valid bag', getBagValidBag);
    });

    describe('can clean values', () => {
        it('correctly', cleanValuesTest);
    });

    describe('can trigger events', () => {
        it('handling component exceptions', triggerEventComponentExceptionTest);
        it('handling promise exceptions', triggerEventPromiseExceptionTest);
        it('handles none promise based returns from components', triggerEventComponentNotPromise);
        it('handles load on all components', triggerEventsLoadOnAllComponents);
        it('ignores components that dont have an event handler', triggerEventIgnoreComponentWithoutEvent);
        it('ignores incorrect components', triggerEventIgnoreComponents);
        it('handling exceptions', triggerEventExceptionTest);
        it('correctly', triggerEventTest);
        it('correctly, handling none promise based results', triggerEventTestNotPromise);        
    });
});