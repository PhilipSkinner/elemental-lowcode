const
    jasmine 			= require('jasmine'),
    sinon 				= require('sinon'),
    integrationInstance	= require('../../../src/service.integration/lib/integrationInstance');

const requestService = {
    sendRequest : () => {}
};

const jsonSchemaVerifier = {
    verify : () => {}
};

const res = {
    json : () => {}
};

const constructorTest = (done) => {
    const instance = integrationInstance();
    expect(instance.requestService).not.toBe(null);
    expect(instance.jsonSchemaVerifier).not.toBe(null);
    done();
};

const requestTest = (done) => {
    const verifyMock = sinon.mock(jsonSchemaVerifier);
    verifyMock.expects('verify').once().withArgs({
        type : 'JSON'
    }, 'the response').returns({});

    const requestMock = sinon.mock(requestService);
    requestMock.expects('sendRequest').once().withArgs({
        name : 'outbound request',
        schema : {
            type : 'JSON',
        }
    }, {
        hello : 'world'
    }).returns(Promise.resolve({
        body : 'the response'
    }));

    const responseMock = sinon.mock(res);
    responseMock.expects('json').once().withArgs('woot?');

    const instance = integrationInstance('doot', {
        request : {
            name : 'outbound request',
            schema : {
                type : 'JSON',
            }
        },
        variables : [
            {
                name : 'hello',
                type : 'queryParam'
            }
        ],
        transformer : '() => { return \'woot?\'; }'
    }, requestService, jsonSchemaVerifier);

    instance.handler({
        query : {
            hello : 'world'
        }
    }, res, () => {
        verifyMock.verify();
        requestMock.verify();
        responseMock.verify();

        done();
    });
};

const missingVariableTest = (done) => {
    const verifyMock = sinon.mock(jsonSchemaVerifier);

    const requestMock = sinon.mock(requestService);

    const responseMock = sinon.mock(res);
    responseMock.expects('json').once().withArgs({
        errors : [
            'Expected queryParam hello but was not found'
        ]
    });

    const instance = integrationInstance('doot', {
        request : {
            name : 'outbound request',
            schema : {
                type : 'JSON',
            }
        },
        variables : [
            {
                name : 'hello',
                type : 'queryParam'
            }
        ],
        transformer : '() => { return \'woot?\'; }'
    }, requestService, jsonSchemaVerifier);

    instance.handler({
        query : {}
    }, res, () => {
        verifyMock.verify();
        requestMock.verify();
        responseMock.verify();

        done();
    });
};

const validationErrorTest = (done) => {
    const verifyMock = sinon.mock(jsonSchemaVerifier);
    verifyMock.expects('verify').once().withArgs({
        type : 'JSON'
    }, 'the response').returns({
        errors : 'oh dear'
    });

    const requestMock = sinon.mock(requestService);
    requestMock.expects('sendRequest').once().withArgs({
        name : 'outbound request',
        schema : {
            type : 'JSON',
        }
    }, {
        hello : 'world'
    }).returns(Promise.resolve({
        body : 'the response'
    }));

    const responseMock = sinon.mock(res);
    responseMock.expects('json').once().withArgs({
        errors : 'oh dear'
    });

    const instance = integrationInstance('doot', {
        request : {
            name : 'outbound request',
            schema : {
                type : 'JSON',
            }
        },
        variables : [
            {
                name : 'hello',
                type : 'queryParam'
            }
        ],
        transformer : '() => { return \'woot?\'; }'
    }, requestService, jsonSchemaVerifier);

    instance.handler({
        query : {
            hello : 'world'
        }
    }, res, () => {
        verifyMock.verify();
        requestMock.verify();
        responseMock.verify();

        done();
    });
};

describe('An integration instance', () => {
    it('defaults its constructor arguments', constructorTest);
    it('can handle requests', requestTest);
    it('handles missing variables', missingVariableTest);
    it('handles validation errors', validationErrorTest);
});