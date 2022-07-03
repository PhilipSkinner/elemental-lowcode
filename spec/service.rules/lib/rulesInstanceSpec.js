const
    jasmine 		= require('jasmine'),
    sinon 			= require('sinon'),
    rulesInstance 	= require('../../../src/service.rules/lib/rulesInstance');

const app = {
    post : () => {}
};

const ajv = {

};

const comparitorService = {
    evaluate : () => {}
};

const securityHandler = {
    enforce : () => {}
};

const constructorTest = (done) => {
    const instance = rulesInstance();
    expect(instance.ajv).not.toBe(null);
    expect(instance.comparitorService).not.toBe(null);
    expect(instance.securityHandler).not.toBe(null);
    done();
};

const initTest = (done) => {
    const appMock = sinon.mock(app);
    appMock.expects('post').once().withArgs('/doot');

    const securityHandlerMock = sinon.mock(securityHandler);
    securityHandlerMock.expects('enforce').once().withArgs(sinon.match.any, {
        mechanism   : null,
        roles       : ['system_admin', 'system_exec', 'rules_exec', 'doot_exec']
    });

    const instance = rulesInstance(app, {
        name : 'doot'
    }, ajv, comparitorService, securityHandler);
    instance.init().then(() => {
        appMock.verify();
        securityHandlerMock.verify();

        done();
    });
};

const invalidFactsTest = (done) => {
    const instance = rulesInstance(app, {
        name 	: 'doot',
        facts 	: {
            type 		: 'object',
            properties 	: {
                value : {
                    type : 'string'
                }
            }
        }
    }, null, comparitorService, securityHandler);
    instance.executeRules({
        body : {
            value : {
                not : 'a string'
            }
        }
    }, {
        status : (code) => {
            expect(code).toEqual(422);
        },
        json : (body) => {
            expect(body).toEqual({
                errors : [
                    {
                        keyword: 'type',
                        dataPath: '.value',
                        schemaPath: '#/properties/value/type',
                        params: {
                            type: 'string'
                        },
                        message: 'should be string'
                    }
                ]
            });
        },
        end : () => {
            done();
        }
    });
};

const noMatchingRulesets = (done) => {
    const comparitorServiceMock = sinon.mock(comparitorService);
    comparitorServiceMock.expects('evaluate').once().withArgs({
        value : 'a string'
    }, 'doot').returns(false);

    const instance = rulesInstance(app, {
        name 	: 'doot',
        facts 	: {
            type 		: 'object',
            properties 	: {
                value : {
                    type : 'string'
                }
            }
        },
        rules : [
            {
                comparitors : 'doot'
            }
        ]
    }, null, comparitorService, securityHandler);
    instance.executeRules({
        body : {
            value : 'a string'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(400);
        },
        json : (body) => {
            expect(body).toBe(null);
        },
        end : () => {
            comparitorServiceMock.verify();

            done();
        }
    });
};

const executionTest = (done) => {
    const comparitorServiceMock = sinon.mock(comparitorService);
    comparitorServiceMock.expects('evaluate').once().withArgs({
        value : 'a string'
    }, 'doot').returns(true);

    const instance = rulesInstance(app, {
        name 	: 'doot',
        facts 	: {
            type 		: 'object',
            properties 	: {
                value : {
                    type : 'string'
                }
            }
        },
        rules : [
            {
                comparitors : 'doot',
                output : {
                    value : 'three'
                }
            }
        ]
    }, null, comparitorService, securityHandler);
    instance.executeRules({
        body : {
            value : 'a string'
        }
    }, {
        json : (body) => {
            expect(body).toEqual({
                value : 'three'
            });
        },
        end : () => {
            comparitorServiceMock.verify();

            done();
        }
    });
};

const roleReplaceTest = (done) => {
    const appMock = sinon.mock(app);
    appMock.expects('post').once().withArgs('/doot');

    const securityHandlerMock = sinon.mock(securityHandler);
    securityHandlerMock.expects('enforce').once().withArgs(sinon.match.any, {
        mechanism   : null,
        roles       : ['system_admin', 'one', 'two']
    });

    const instance = rulesInstance(app, {
        name : 'doot',
        roles : {
            replace : {
                exec : true
            },
            exec : [
                'one',
                'two'
            ]
        }
    }, ajv, comparitorService, securityHandler);
    instance.init().then(() => {
        appMock.verify();
        securityHandlerMock.verify();

        done();
    });
};

const extraRolesTest = (done) => {
    const appMock = sinon.mock(app);
    appMock.expects('post').once().withArgs('/doot');

    const securityHandlerMock = sinon.mock(securityHandler);
    securityHandlerMock.expects('enforce').once().withArgs(sinon.match.any, {
        mechanism   : 'test',
        roles       : ['system_admin', 'system_exec', 'rules_exec', 'doot_exec', 'one', 'two']
    });

    const instance = rulesInstance(app, {
        name : 'doot',
        security : {
            mechanism : 'test'
        },
        roles : {
            replace : {},
            exec : [
                'one',
                'two'
            ],
            needsRole : {}
        }
    }, ajv, comparitorService, securityHandler);
    instance.init().then(() => {
        appMock.verify();
        securityHandlerMock.verify();

        done();
    });
};

const noRolesTest = (done) => {
    const appMock = sinon.mock(app);
    appMock.expects('post').once().withArgs('/doot');

    const securityHandlerMock = sinon.mock(securityHandler);
    securityHandlerMock.expects('enforce').once().withArgs(sinon.match.any, {
        mechanism   : null,
        roles       : null
    });

    const instance = rulesInstance(app, {
        name : 'doot',
        roles : {
            needsRole : {
                exec : false
            }
        }
    }, ajv, comparitorService, securityHandler);
    instance.init().then(() => {
        appMock.verify();
        securityHandlerMock.verify();

        done();
    });
};

describe('A rules service instance', () => {
    it('defaults its constructor arguments', constructorTest);
    it('initialises its endpoints', initTest);

    describe('can execute rules', () => {
        it('handling invalid facts', invalidFactsTest);
        it('handling no matching rulesets', noMatchingRulesets);
        it('correctly executing  rules', executionTest);
        it('handling role replacement', roleReplaceTest);
        it('handling extra roles', extraRolesTest);
        it('handling no roles', noRolesTest);
    });
});