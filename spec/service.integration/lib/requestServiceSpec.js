const
    jasmine 		= require('jasmine'),
    sinon 			= require('sinon'),
    requestService	= require('../../../src/service.integration/lib/requestService');

const request = {
    main : () => {}
};

const stringParser = {
    detectValues : () => {}
};

const environmentService = {
    listSecrets : () => {}
};

const constructorTest = (done) => {
    const instance = requestService();
    expect(instance.request).not.toBe(null);
    expect(instance.stringParser).not.toBe(null);
    expect(instance.environmentService).not.toBe(null);
    done();
};

const requestTest = (done) => {
    const requestMock = sinon.mock(request);
    requestMock.expects('main').once().withArgs({
        method  : 'GET',
        uri		: 'http://elementalsystem.org?hello=world'
    }).callsArgWith(1, null, 'my nice result');

    const parserMock = sinon.mock(stringParser);
    parserMock.expects('detectValues').once().withArgs('http://elementalsystem.org', {
        variables : {
            hello : 'world'
        }
    }).returns('http://elementalsystem.org?hello=world');

    const instance = requestService(request.main, stringParser);
    instance.sendRequest({
        method : 'GET',
        uri : 'http://elementalsystem.org'
    }, {
        hello : 'world'
    }).then((result) => {
        requestMock.verify();
        parserMock.verify();

        expect(result).toEqual('my nice result');

        done();
    });
};

const errorTest = (done) => {
    const requestMock = sinon.mock(request);
    requestMock.expects('main').once().withArgs({
        method  : 'GET',
        uri		: 'http://elementalsystem.org?hello=world'
    }).callsArgWith(1, new Error('network was eaten'));

    const parserMock = sinon.mock(stringParser);
    parserMock.expects('detectValues').once().withArgs('http://elementalsystem.org', {
        variables : {
            hello : 'world'
        }
    }).returns('http://elementalsystem.org?hello=world');

    const instance = requestService(request.main, stringParser);
    instance.sendRequest({
        method : 'GET',
        uri : 'http://elementalsystem.org'
    }, {
        hello : 'world'
    }).catch((err) => {
        requestMock.verify();
        parserMock.verify();

        expect(err).toEqual(new Error('network was eaten'));

        done();
    });
};

const unknownAuthTest = (done) => {
    const requestMock = sinon.mock(request);
    requestMock.expects('main').once().withArgs({
        method  : 'GET',
        uri     : 'http://elementalsystem.org?hello=world'
    }).callsArgWith(1, null, 'my nice result');

    const parserMock = sinon.mock(stringParser);
    parserMock.expects('detectValues').once().withArgs('http://elementalsystem.org', {
        variables : {
            hello : 'world'
        }
    }).returns('http://elementalsystem.org?hello=world');

    const instance = requestService(request.main, stringParser);
    instance.sendRequest({
        method : 'GET',
        uri : 'http://elementalsystem.org',
        authentication : {
            mechanism : 'what?'
        }
    }, {
        hello : 'world'
    }).then((result) => {
        requestMock.verify();
        parserMock.verify();

        expect(result).toEqual('my nice result');

        done();
    });
};

const httpBasicTest = (done) => {
    const requestMock = sinon.mock(request);
    requestMock.expects('main').once().withArgs({
        method  : 'GET',
        uri     : 'http://elementalsystem.org?hello=world',
        headers : {
            Authorization : 'Basic dXNlcm5hbWU6cGFzc3dvcmQ='
        }
    }).callsArgWith(1, null, 'my nice result');

    const parserMock = sinon.mock(stringParser);
    parserMock.expects('detectValues').once().withArgs('http://elementalsystem.org', {
        variables : {
            hello : 'world'
        }
    }).returns('http://elementalsystem.org?hello=world');
    parserMock.expects('detectValues').once().withArgs('$.variables.username', {
        variables : {
            hello : 'world'
        },
        secret : 'some-secrets'
    }).returns('username');
    parserMock.expects('detectValues').once().withArgs('$.secret.password', {
        variables : {
            hello : 'world'
        },
        secret : 'some-secrets'
    }).returns('password');

    const environmentMock = sinon.mock(environmentService);
    environmentMock.expects('listSecrets').once().returns('some-secrets');

    const instance = requestService(request.main, stringParser, environmentService);
    instance.sendRequest({
        method : 'GET',
        uri : 'http://elementalsystem.org',
        authentication : {
            mechanism : 'http_basic',
            config : {
                username : '$.variables.username',
                password : '$.secret.password'
            }
        }
    }, {
        hello : 'world'
    }).then((result) => {
        requestMock.verify();
        parserMock.verify();
        environmentMock.verify();

        expect(result).toEqual('my nice result');

        done();
    });
};

const bearerTokenTest = (done) => {
    const requestMock = sinon.mock(request);
    requestMock.expects('main').once().withArgs({
        method  : 'GET',
        uri     : 'http://elementalsystem.org?hello=world',
        headers : {
            Authorization : 'Bearer secret_value'
        }
    }).callsArgWith(1, null, 'my nice result');

    const parserMock = sinon.mock(stringParser);
    parserMock.expects('detectValues').once().withArgs('http://elementalsystem.org', {
        variables : {
            hello : 'world'
        }
    }).returns('http://elementalsystem.org?hello=world');
    parserMock.expects('detectValues').once().withArgs('$.secret.token', {
        variables : {
            hello : 'world'
        },
        secret : 'some-secrets'
    }).returns('secret_value');

    const environmentMock = sinon.mock(environmentService);
    environmentMock.expects('listSecrets').once().returns('some-secrets');

    const instance = requestService(request.main, stringParser, environmentService);
    instance.sendRequest({
        method : 'GET',
        uri : 'http://elementalsystem.org',
        authentication : {
            mechanism : 'token',
            type : 'bearer',
            config : {
                token : '$.secret.token'
            }
        }
    }, {
        hello : 'world'
    }).then((result) => {
        requestMock.verify();
        parserMock.verify();
        environmentMock.verify();

        expect(result).toEqual('my nice result');

        done();
    });
};

const queryParamTokenTest = (done) => {
    const requestMock = sinon.mock(request);
    requestMock.expects('main').once().withArgs({
        method  : 'GET',
        uri     : 'http://elementalsystem.org/?hello=world&token_param=secret_value'
    }).callsArgWith(1, null, 'my nice result');

    const parserMock = sinon.mock(stringParser);
    parserMock.expects('detectValues').once().withArgs('http://elementalsystem.org', {
        variables : {
            hello : 'world'
        }
    }).returns('http://elementalsystem.org?hello=world');
    parserMock.expects('detectValues').once().withArgs('$.secret.token', {
        variables : {
            hello : 'world'
        },
        secret : 'some-secrets'
    }).returns('secret_value');

    const environmentMock = sinon.mock(environmentService);
    environmentMock.expects('listSecrets').once().returns('some-secrets');

    const instance = requestService(request.main, stringParser, environmentService);
    instance.sendRequest({
        method : 'GET',
        uri : 'http://elementalsystem.org',
        authentication : {
            mechanism : 'token',
            type : 'query',
            config : {
                token : '$.secret.token',
                param : 'token_param'
            }
        }
    }, {
        hello : 'world'
    }).then((result) => {
        requestMock.verify();
        parserMock.verify();
        environmentMock.verify();

        expect(result).toEqual('my nice result');

        done();
    });
};

describe('A HTTP request service', () => {
    it('defaults its constructor arguments', constructorTest);
    it('can make a request', requestTest);
    it('can handle request errors', errorTest);
    it('ignores unknown authentication mechanisms', unknownAuthTest);
    it('supports HTTP basic authentication', httpBasicTest);
    it('supports bearer token authentication', bearerTokenTest);
    it('supports query param token authentication', queryParamTokenTest);
});