const
    jasmine 			= require('jasmine'),
    sinon 				= require('sinon'),
    integrationService 	= require('../../src/support.lib/integrationService');

const request = {
    post : () => {}
};

const hostnameResolver = {
    resolveIntegration : () => {}
};

const authClientProvider = {
    getAccessToken : () => {}
};


const constructorTest = (done) => {
    const instance = integrationService();
    expect(instance.request).not.toBe(null);
    done();
};

const callIntegrationTest = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveIntegration').returns('http://integrations');

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://integrations/integration', {
        qs : null,
        headers : {
            Authorization : 'Bearer '
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, '{"hello":"world"}');

    const instance = integrationService(request, hostnameResolver);

    instance.callIntegration('integration', 'post', null).then(() => {
        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const callIntegrationInvalidJSON = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveIntegration').returns('http://integrations');

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://integrations/integration', {
        qs : null,
        headers : {
            Authorization : 'Bearer '
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, '}{SD{A}WD{}W{D}AW{D}AW{D}AW{D');

    const instance = integrationService(request, hostnameResolver);

    instance.callIntegration('integration', 'post', null).catch((err) => {
        expect(err).toEqual(new Error('Invalid response received from integration call'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const callIntegrationRequestError = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveIntegration').returns('http://integrations');

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://integrations/integration', {
        qs : null,
        headers : {
            Authorization : 'Bearer '
        }
    }).callsArgWith(2, new Error('oops'));

    const instance = integrationService(request, hostnameResolver);

    instance.callIntegration('integration', 'post', null).catch((err) => {
        expect(err).toEqual(new Error('oops'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const callIntegrationAuthToken = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveIntegration').returns('http://integrations');

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://integrations/integration', {
        qs : null,
        headers : {
            Authorization : 'Bearer my token'
        }
    }).callsArgWith(2, new Error('oops'));

    const instance = integrationService(request, hostnameResolver);

    instance.callIntegration('integration', 'post', null, 'my token').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const callIntegrationAuthProvider = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveIntegration').returns('http://integrations');

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://integrations/integration', {
        qs : null,
        headers : {
            Authorization : 'Bearer a token'
        }
    }).callsArgWith(2, new Error('oops'));

    const authClientProviderMock = sinon.mock(authClientProvider);
    authClientProviderMock.expects('getAccessToken').once().returns(Promise.resolve('a token'));

    const instance = integrationService(request, hostnameResolver);
    instance.setAuthClientProvider(authClientProvider);

    instance.callIntegration('integration', 'post', null).catch((err) => {
        expect(err).toEqual(new Error('oops'));

        authClientProviderMock.verify();
        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

describe('An integrations service client', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('call integration', () => {
        it('works', callIntegrationTest);
        it('handles invalid JSON', callIntegrationInvalidJSON);
        it('handles request errors', callIntegrationRequestError);
        it('handles a given auth token', callIntegrationAuthToken);
        it('uses the auth provider', callIntegrationAuthProvider);
    });
});