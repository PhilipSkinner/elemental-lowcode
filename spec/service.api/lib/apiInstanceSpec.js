const
    jasmine 		= require('jasmine'),
    sinon 			= require('sinon'),
    apiInstance		= require('../../../src/service.api/lib/apiInstance');

const app = {
    get : () => {},
    post : () => {}
};

const securityHandler = {
    enforce : () => {}
};

const serviceProvider = {
    name : 'serviceProvider'
};

const storageService = {
    name : 'storageService'
};

const integrationService = {
    name : 'integrationService'
};

const rulesetService = {
    name : 'rulesetService'
};

const idmService = {
    name : 'idmService'
};

const authClientProvider = {
    name : 'authClientProvider'
};

const messagingService = {
    name 					: 'messagingService',
    setAuthClientProvider 	: () => {}
};

const environmentService = {

};

const locationService = {

};

const blobService = {

};

const constructorTest = (done) => {
    const instance = apiInstance();
    expect(instance.securityHandler).not.toBe(null);
    expect(instance.serviceProvider).not.toBe(null);
    expect(instance.storageService).not.toBe(null);
    expect(instance.integrationService).not.toBe(null);
    expect(instance.rulesetService).not.toBe(null);
    expect(instance.idmService).not.toBe(null);
    expect(instance.authClientProvider).not.toBe(null);
    expect(instance.messagingService).not.toBe(null);
    done();
};

const controllerResolutionTest = (done) => {
    const messagingMock = sinon.mock(messagingService);
    messagingMock.expects('setAuthClientProvider').once();

    const myController = function() {
        return () => {
            expect(this.serviceProvider.name).toEqual('serviceProvider');
            expect(this.storageService.name).toEqual('storageService');
            expect(this.integrationService.name).toEqual('integrationService');
            expect(this.rulesetService.name).toEqual('rulesetService');
            expect(this.idmService.name).toEqual('idmService');
            expect(this.messagingService.name).toEqual('messagingService');

            messagingMock.verify();

            done();
        };
    };
    const instance = apiInstance(null, {
        controllers : {
            myController : myController
        }
    }, securityHandler, serviceProvider, storageService, integrationService, rulesetService, idmService, authClientProvider, messagingService, environmentService, locationService, blobService);

    const controllerInstance = instance.resolveController('myController');

    controllerInstance();
};

const endpointSetupTest = (done) => {
    const appMock = sinon.mock(app);
    appMock.expects('get').once().withArgs('/testbasicRoles');
    appMock.expects('post').once().withArgs('/testbasicRoles');
    appMock.expects('get').once().withArgs('/testnoRoles');
    appMock.expects('post').once().withArgs('/testnoRoles');
    appMock.expects('get').once().withArgs('/testextraRoles');
    appMock.expects('post').once().withArgs('/testextraRoles');
    appMock.expects('get').once().withArgs('/testreplaceRoles');
    appMock.expects('post').once().withArgs('/testreplaceRoles');

    const securityHandlerMock = sinon.mock(securityHandler);
    securityHandlerMock.expects('enforce').once().withArgs(sinon.match.any, {
        mechanism   : undefined,
        roles       : ['system_admin', 'system_reader', 'api_reader', 'test_reader']
    });
    securityHandlerMock.expects('enforce').once().withArgs(sinon.match.any, {
        mechanism   : undefined,
        roles       : ['system_admin', 'system_writer', 'api_writer', 'test_writer']
    });
    securityHandlerMock.expects('enforce').twice().withArgs(sinon.match.any, {
        mechanism   : undefined,
        roles       : null
    });
    securityHandlerMock.expects('enforce').once().withArgs(sinon.match.any, {
        mechanism   : undefined,
        roles       : ['system_admin', 'system_reader', 'api_reader', 'test_reader', 'two']
    });
    securityHandlerMock.expects('enforce').once().withArgs(sinon.match.any, {
        mechanism   : 'test',
        roles       : ['system_admin', 'system_writer', 'api_writer', 'test_writer', 'one']
    });
    securityHandlerMock.expects('enforce').once().withArgs(sinon.match.any, {
        mechanism   : undefined,
        roles       : ['system_admin', 'two']
    });
    securityHandlerMock.expects('enforce').once().withArgs(sinon.match.any, {
        mechanism   : undefined,
        roles       : ['system_admin', 'one']
    });

    const instance = apiInstance(app, {
        name : 'test',
        controllers : {
			
        },
        routes : {
            blank : {},
            basicRoles : {
                get : {

                },
                post : {

                }
            },
            noRoles : {
                post : {
                    needsRole : false
                },
                get : {
                    needsRole : false
                }
            },
            extraRoles : {
                post : {
                    mechanism : 'test',
                    roles : [
                        'one'
                    ]
                },
                get : {
                    roles : [
                        'two'
                    ]
                }
            },
            replaceRoles : {
                post : {
                    roles : [
                        'one'
                    ],
                    replace : true
                },
                get : {
                    roles : [
                        'two'
                    ],
                    replace : true
                }
            }
        }
    }, securityHandler, serviceProvider, storageService, integrationService, rulesetService, idmService, authClientProvider, messagingService, environmentService, locationService, blobService);

    instance.init().then(() => {
        appMock.verify();
        securityHandlerMock.verify();

        done();
    });
};

describe('An API instance', () => {
    it('defaults its constructor arguments', constructorTest);
    it('can resolve its controller', controllerResolutionTest);
    it('can setup its endpoints correctly', endpointSetupTest);
});