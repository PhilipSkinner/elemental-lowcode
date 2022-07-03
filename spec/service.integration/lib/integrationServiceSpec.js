const
    jasmine 			= require('jasmine'),
    sinon 				= require('sinon'),
    integrationService	= require('../../../src/service.integration/lib/integrationService');

const configReader = {
    readConfigFromDir : () => {}
};

const integrationInstance = {
    main : () => {},
    handler : () => {}
};

const securityHandler = {
    enforce : () => {}
};

const app = {
    get : () => {}
};

const constructorTest = (done) => {
    const instance = integrationService();
    expect(instance.configReader).not.toBe(null);
    expect(instance.integrationInstance).not.toBe(null);
    expect(instance.securityHandler).not.toBe(null);
    expect(instance.hostedEndpoints).not.toBe(null);
    done();
};

const endpointInitTest = (done) => {
    const configMock = sinon.mock(configReader);
    configMock.expects('readConfigFromDir').once().withArgs('doot').returns(Promise.resolve({
        basicRoles : {
            method : 'get'
        },
        replaceRoles : {
            method : 'get',
            security : {
                mechanism : 'test',
            },
            roles : {
                replace : {
                    exec : true
                },
                exec : [
                    'one',
                    'two'
                ]
            }
        },
        noRoles : {
            method : 'get',
            roles : {
                needsRole : {
                    exec : false
                }
            }
        },
        extraRoles : {
            method : 'get',
            roles : {
                exec : [
                    'one',
                    'two'
                ]
            }
        }
    }));

    const integrationMock = sinon.mock(integrationInstance);
    integrationMock.expects('main').once().withArgs('basicRoles', {
        method : 'get'
    }).returns(integrationInstance);
    integrationMock.expects('main').once().withArgs('replaceRoles', {
        method : 'get',
        security : {
            mechanism : 'test',
        },
        roles : {
            replace : {
                exec : true
            },
            exec : [
                'one',
                'two'
            ]
        }
    }).returns(integrationInstance);
    integrationMock.expects('main').once().withArgs('noRoles', {
        method : 'get',
        roles : {
            needsRole : {
                exec : false
            }
        }
    }).returns(integrationInstance);
    integrationMock.expects('main').once().withArgs('extraRoles', {
        method : 'get',
        roles : {
            exec : [
                'one',
                'two'
            ]
        }
    }).returns(integrationInstance);

    const securityHandlerMock = sinon.mock(securityHandler);
    securityHandlerMock.expects('enforce').once().withArgs(sinon.match.any, {
        mechanism   : null,
        roles       : [
            'system_admin',
            'system_exec',
            'integration_exec',
            'basicRoles_exec'
        ]
    }).returns('basic roles');
    securityHandlerMock.expects('enforce').once().withArgs(sinon.match.any, {
        mechanism   : 'test',
        roles       : [
            'system_admin',
            'one',
            'two'
        ]
    }).returns('replace roles');
    securityHandlerMock.expects('enforce').once().withArgs(sinon.match.any, {
        mechanism   : null,
        roles       : null
    }).returns('no roles');
    securityHandlerMock.expects('enforce').once().withArgs(sinon.match.any, {
        mechanism   : null,
        roles       : [
            'system_admin',
            'system_exec',
            'integration_exec',
            'extraRoles_exec',
            'one',
            'two'
        ]
    }).returns('extra roles');

    securityHandlerMock.expects('enforce').once().withArgs(sinon.match.any, {
        mechanism   : null,
        roles       : [
            'system_admin',
            'system_reader',
            'integration_reader'
        ]
    }).returns('discovery endpoint');

    const appMock = sinon.mock(app);
    appMock.expects('get').once().withArgs('/basicRoles', 'basic roles');
    appMock.expects('get').once().withArgs('/replaceRoles', 'replace roles');
    appMock.expects('get').once().withArgs('/noRoles', 'no roles');
    appMock.expects('get').once().withArgs('/extraRoles', 'extra roles');
    appMock.expects('get').once().withArgs('/', 'discovery endpoint');

    const instance = integrationService(app, configReader, integrationInstance.main, securityHandler);
    instance.init('doot').then(() => {
        configMock.verify();
        integrationMock.verify();
        securityHandlerMock.verify();
        appMock.verify();

        done();
    });
};

describe('An integration service', () => {
    it('defaults its constructor arguments', constructorTest);
    it('can initialise its endpoints', endpointInitTest);
});