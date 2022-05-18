const
    sinon               = require('sinon'),
    messagingService    = require('../../src/support.lib/messagingService');

const request = {
    post : () => {},
    get : () => {},
    delete : () => {}
};

const hostnameResolver = {
    resolveQueue : () => {}
};

const authClientProvider = {
    getAccessToken : () => {}
};


const constructorTest = (done) => {
    const instance = messagingService();
    expect(instance.request).not.toBe(null);
    done();
};

const queueMessageTest = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveQueue').returns('http://queues');

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://queues/queuename', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer ',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, null, {
        statusCode : 201,
        headers : {
            location : '/queuename/1234'
        }
    });

    const instance = messagingService(request, hostnameResolver);

    instance.queueMessage('queuename', 'my-entity').then((response) => {
        expect(response).toEqual('1234');

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const queueMessageInvalidStatusCode = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveQueue').returns('http://queues');

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://queues/queuename', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer ',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, null, {
        statusCode : 500
    }, 'oops');

    const instance = messagingService(request, hostnameResolver);

    instance.queueMessage('queuename', 'my-entity').catch((err) => {
        expect(err).toEqual(new Error('Invalid response received'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const queueMessageRequestError = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveQueue').returns('http://queues');

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://queues/queuename', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer ',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, new Error('oops'));

    const instance = messagingService(request, hostnameResolver);

    instance.queueMessage('queuename', 'my-entity').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const queueMessageAuthToken = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveQueue').returns('http://queues');

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://queues/queuename', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer my token',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, new Error('oops'));

    const instance = messagingService(request, hostnameResolver);

    instance.queueMessage('queuename', 'my-entity', 'my token').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const queueMessageAuthProvider = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveQueue').returns('http://queues');

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://queues/queuename', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer a token',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, new Error('oops'));

    const authClientProviderMock = sinon.mock(authClientProvider);
    authClientProviderMock.expects('getAccessToken').once().returns(Promise.resolve('a token'));

    const instance = messagingService(request, hostnameResolver);
    instance.setAuthClientProvider(authClientProvider);

    instance.queueMessage('queuename', 'my-entity').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        authClientProviderMock.verify();
        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const getMessageTest = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveQueue').returns('http://queues');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://queues/queuename/id', {
        headers : {
            Authorization : 'Bearer '
        }
    }).callsArgWith(2, null, {
        statusCode : 201,
        headers : {
            location : '/queuename/1234'
        }
    });

    const instance = messagingService(request, hostnameResolver);

    instance.getMessage('queuename', 'id').then((response) => {
        expect(response).toEqual('1234');

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const getMessageInvalidStatusCode = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveQueue').returns('http://queues');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://queues/queuename/id', {
        headers : {
            Authorization : 'Bearer '
        }
    }).callsArgWith(2, null, {
        statusCode : 500
    }, 'oops');

    const instance = messagingService(request, hostnameResolver);

    instance.getMessage('queuename', 'id').catch((err) => {
        expect(err).toEqual(new Error('Invalid response received'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const getMessageRequestError = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveQueue').returns('http://queues');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://queues/queuename/id', {
        headers : {
            Authorization : 'Bearer '
        }
    }).callsArgWith(2, new Error('oops'));

    const instance = messagingService(request, hostnameResolver);

    instance.getMessage('queuename', 'id').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const getMessageAuthToken = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveQueue').returns('http://queues');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://queues/queuename/id', {
        headers : {
            Authorization : 'Bearer my token'
        }
    }).callsArgWith(2, new Error('oops'));

    const instance = messagingService(request, hostnameResolver);

    instance.getMessage('queuename', 'id', 'my token').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const getMessageAuthProvider = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveQueue').returns('http://queues');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://queues/queuename/id', {
        headers : {
            Authorization : 'Bearer a token'
        }
    }).callsArgWith(2, new Error('oops'));

    const authClientProviderMock = sinon.mock(authClientProvider);
    authClientProviderMock.expects('getAccessToken').once().returns(Promise.resolve('a token'));

    const instance = messagingService(request, hostnameResolver);
    instance.setAuthClientProvider(authClientProvider);

    instance.getMessage('queuename', 'id').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        authClientProviderMock.verify();
        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const deleteMessageTest = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveQueue').returns('http://queues');

    const requestMock = sinon.mock(request);
    requestMock.expects('delete').once().withArgs('http://queues/queuename/id', {
        headers : {
            Authorization : 'Bearer '
        }
    }).callsArgWith(2, null, {
        statusCode : 201,
        headers : {
            location : '/queuename/1234'
        }
    });

    const instance = messagingService(request, hostnameResolver);

    instance.deleteMessage('queuename', 'id').then((response) => {
        expect(response).toEqual('1234');

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const deleteMessageInvalidStatusCode = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveQueue').returns('http://queues');

    const requestMock = sinon.mock(request);
    requestMock.expects('delete').once().withArgs('http://queues/queuename/id', {
        headers : {
            Authorization : 'Bearer '
        }
    }).callsArgWith(2, null, {
        statusCode : 500
    }, 'oops');

    const instance = messagingService(request, hostnameResolver);

    instance.deleteMessage('queuename', 'id').catch((err) => {
        expect(err).toEqual(new Error('Invalid response received'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const deleteMessageRequestError = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveQueue').returns('http://queues');

    const requestMock = sinon.mock(request);
    requestMock.expects('delete').once().withArgs('http://queues/queuename/id', {
        headers : {
            Authorization : 'Bearer '
        }
    }).callsArgWith(2, new Error('oops'));

    const instance = messagingService(request, hostnameResolver);

    instance.deleteMessage('queuename', 'id').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const deleteMessageAuthToken = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveQueue').returns('http://queues');

    const requestMock = sinon.mock(request);
    requestMock.expects('delete').once().withArgs('http://queues/queuename/id', {
        headers : {
            Authorization : 'Bearer my token'
        }
    }).callsArgWith(2, new Error('oops'));

    const instance = messagingService(request, hostnameResolver);

    instance.deleteMessage('queuename', 'id', 'my token').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const deleteMessageAuthProvider = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveQueue').returns('http://queues');

    const requestMock = sinon.mock(request);
    requestMock.expects('delete').once().withArgs('http://queues/queuename/id', {
        headers : {
            Authorization : 'Bearer a token'
        }
    }).callsArgWith(2, new Error('oops'));

    const authClientProviderMock = sinon.mock(authClientProvider);
    authClientProviderMock.expects('getAccessToken').once().returns(Promise.resolve('a token'));

    const instance = messagingService(request, hostnameResolver);
    instance.setAuthClientProvider(authClientProvider);

    instance.deleteMessage('queuename', 'id').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        authClientProviderMock.verify();
        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

describe('A messaging service client', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('call ruleset', () => {
        it('works', queueMessageTest);
        it('handles invalid status codes', queueMessageInvalidStatusCode);
        it('handles request errors', queueMessageRequestError);
        it('handles a given auth token', queueMessageAuthToken);
        it('uses the auth provider', queueMessageAuthProvider);
    });

    describe('get message', () => {
        it('works', getMessageTest);
        it('handles invalid status codes', getMessageInvalidStatusCode);
        it('handles request errors', getMessageRequestError);
        it('handles a given auth token', getMessageAuthToken);
        it('uses the auth provider', getMessageAuthProvider);
    });

    describe('delete message', () => {
        it('works', deleteMessageTest);
        it('handles invalid status codes', deleteMessageInvalidStatusCode);
        it('handles request errors', deleteMessageRequestError);
        it('handles a given auth token', deleteMessageAuthToken);
        it('uses the auth provider', deleteMessageAuthProvider);
    });
});