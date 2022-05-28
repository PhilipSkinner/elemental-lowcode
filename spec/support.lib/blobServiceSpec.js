const
    sinon       = require('sinon'),
    blobService = require('../../src/support.lib/blobService');

const request = {
    get : () => {},
    put : () => {},
    delete : () => {},
};

const hostnameResolver = {
    resolveBlob : () => {}
};

const fs = {
    createReadStream : () => {}
};

const authClientProvider = {
    getAccessToken : () => {}
};

const constructorTest = () => {
    const instance = blobService();

    expect(instance.request).not.toBe(undefined);
    expect(instance.request).not.toBe(null);
    expect(instance.hostnameResolver).not.toBe(undefined);
    expect(instance.hostnameResolver).not.toBe(null);
    expect(instance.fs).not.toBe(undefined);
    expect(instance.fs).not.toBe(null);
    expect(instance.authClientProvider).toBe(null);
};

const detailsRequestError = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveBlob').once().returns('http://blob.store');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://blob.store/store/path', {
        headers : {
            Authorization : 'Bearer token',
            Accept : 'application/json'
        }
    }).callsArgWith(2, new Error('oh no'));

    const instance = blobService(request, hostnameResolver, fs);

    instance.details('store', 'path', 'token').catch((err) => {
        expect(err).toEqual(new Error('oh no'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const detailsInvalidStatusCode = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveBlob').once().returns('http://blob.store');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://blob.store/store/path', {
        headers : {
            Authorization : 'Bearer token',
            Accept : 'application/json'
        }
    }).callsArgWith(2, null, {
        statusCode : 404
    });

    const instance = blobService(request, hostnameResolver, fs);

    instance.details('store', 'path', 'token').catch((err) => {
        expect(err).toEqual(new Error('Invalid status code returned: 404'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const detailsInvalidResponse = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveBlob').once().returns('http://blob.store');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://blob.store/store/path', {
        headers : {
            Authorization : 'Bearer token',
            Accept : 'application/json'
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, '}{S}{}SD{}A{WD}{WD}AW{D}AW{D');

    const instance = blobService(request, hostnameResolver, fs);

    instance.details('store', 'path', 'token').catch((err) => {
        expect(err).toEqual(new Error('Invalid response received'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const detailsAutoAccessToken = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveBlob').once().returns('http://blob.store');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://blob.store/store/path', {
        headers : {
            Authorization : 'Bearer auto_token',
            Accept : 'application/json'
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, '{"hello":"world"}');

    const authClientProviderMock = sinon.mock(authClientProvider);
    authClientProviderMock.expects('getAccessToken').once().returns(Promise.resolve('auto_token'));

    const instance = blobService(request, hostnameResolver, fs);
    instance.setAuthClientProvider(authClientProvider);

    instance.details('store', 'path').then((res) => {
        expect(res).toEqual({
            hello : 'world'
        });

        hostnameMock.verify();
        requestMock.verify();
        authClientProviderMock.verify();

        done();
    });
};

const detailsUndefinedAuthClientProvider = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveBlob').once().returns('http://blob.store');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://blob.store/store/path', {
        headers : {
            Authorization : 'Bearer ',
            Accept : 'application/json'
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, '{"hello":"world"}');

    const instance = blobService(request, hostnameResolver, fs);

    instance.details('store', 'path').then((res) => {
        expect(res).toEqual({
            hello : 'world'
        });

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const uploadRequestError = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveBlob').once().returns('http://blob.store');

    const requestMock = sinon.mock(request);
    requestMock.expects('put').once().withArgs('http://blob.store/store/path', {
        headers : {
            Authorization : 'Bearer token'
        },
        formData : {
            file : 'read-stream'
        }
    }).callsArgWith(2, new Error('oh no'));

    const fsMock = sinon.mock(fs);
    fsMock.expects('createReadStream').once().withArgs(['data']).returns('read-stream');

    const instance = blobService(request, hostnameResolver, fs);

    instance.upload('store', 'path', {
        data : ['data']
    }, 'token').catch((err) => {
        expect(err).toEqual(new Error('oh no'));

        hostnameMock.verify();
        requestMock.verify();
        fsMock.verify();

        done();
    });
};

const uploadInvalidStatusCode = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveBlob').once().returns('http://blob.store');

    const requestMock = sinon.mock(request);
    requestMock.expects('put').once().withArgs('http://blob.store/store/path', {
        headers : {
            Authorization : 'Bearer token'
        },
        formData : {
            file : 'read-stream'
        }
    }).callsArgWith(2, null, {
        statusCode : 401
    });

    const fsMock = sinon.mock(fs);
    fsMock.expects('createReadStream').once().withArgs(['data']).returns('read-stream');

    const instance = blobService(request, hostnameResolver, fs);

    instance.upload('store', 'path', {
        data : ['data']
    }, 'token').catch((err) => {
        expect(err).toEqual(new Error('Invalid status code returned: 401'));

        hostnameMock.verify();
        requestMock.verify();
        fsMock.verify();

        done();
    });
};

const uploadAutoAccessToken = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveBlob').once().returns('http://blob.store');

    const requestMock = sinon.mock(request);
    requestMock.expects('put').once().withArgs('http://blob.store/store/path', {
        headers : {
            Authorization : 'Bearer auto_token'
        },
        formData : {
            file : 'read-stream'
        }
    }).callsArgWith(2, null, {
        statusCode : 201
    });

    const fsMock = sinon.mock(fs);
    fsMock.expects('createReadStream').once().withArgs(['data']).returns('read-stream');

    const authClientProviderMock = sinon.mock(authClientProvider);
    authClientProviderMock.expects('getAccessToken').once().returns(Promise.resolve('auto_token'));

    const instance = blobService(request, hostnameResolver, fs);
    instance.setAuthClientProvider(authClientProvider);

    instance.upload('store', 'path', {
        data : ['data']
    }).then(() => {
        hostnameMock.verify();
        requestMock.verify();
        fsMock.verify();
        authClientProviderMock.verify();

        done();
    });
};

const uploadUndefinedAuthClientProvider = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveBlob').once().returns('http://blob.store');

    const requestMock = sinon.mock(request);
    requestMock.expects('put').once().withArgs('http://blob.store/store/path', {
        headers : {
            Authorization : 'Bearer '
        },
        formData : {
            file : 'read-stream'
        }
    }).callsArgWith(2, null, {
        statusCode : 201
    });

    const fsMock = sinon.mock(fs);
    fsMock.expects('createReadStream').once().withArgs('hello there').returns('read-stream');

    const instance = blobService(request, hostnameResolver, fs);

    instance.upload('store', 'path', {
        data : [],
        tempFilePath : 'hello there'
    }).then(() => {
        hostnameMock.verify();
        requestMock.verify();
        fsMock.verify();

        done();
    });
};

const uploadTemporaryFiles = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveBlob').once().returns('http://blob.store');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://blob.store/store/path', {
        headers : {
            Authorization : 'Bearer ',
            Accept : 'application/octet-stream'
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, 'payload');

    const instance = blobService(request, hostnameResolver, fs);

    instance.download('store', 'path').then((res) => {
        expect(res).toEqual('payload');

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const downloadRequestError = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveBlob').once().returns('http://blob.store');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://blob.store/store/path', {
        headers : {
            Authorization : 'Bearer token',
            Accept : 'application/octet-stream'
        }
    }).callsArgWith(2, new Error('oh no'));

    const instance = blobService(request, hostnameResolver, fs);

    instance.download('store', 'path', 'token').catch((err) => {
        expect(err).toEqual(new Error('oh no'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const downloadInvalidStatusCode = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveBlob').once().returns('http://blob.store');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://blob.store/store/path', {
        headers : {
            Authorization : 'Bearer token',
            Accept : 'application/octet-stream'
        }
    }).callsArgWith(2, null, {
        statusCode : 404
    });

    const instance = blobService(request, hostnameResolver, fs);

    instance.download('store', 'path', 'token').catch((err) => {
        expect(err).toEqual(new Error('Invalid status code returned: 404'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const downloadAutoAccessToken = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveBlob').once().returns('http://blob.store');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://blob.store/store/path', {
        headers : {
            Authorization : 'Bearer auto_token',
            Accept : 'application/octet-stream'
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, 'payload');

    const authClientProviderMock = sinon.mock(authClientProvider);
    authClientProviderMock.expects('getAccessToken').once().returns(Promise.resolve('auto_token'));

    const instance = blobService(request, hostnameResolver, fs);
    instance.setAuthClientProvider(authClientProvider);

    instance.download('store', 'path').then((res) => {
        expect(res).toEqual('payload');

        hostnameMock.verify();
        requestMock.verify();
        authClientProviderMock.verify();

        done();
    });
};

const downloadUndefinedAuthClientProvider = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveBlob').once().returns('http://blob.store');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://blob.store/store/path', {
        headers : {
            Authorization : 'Bearer ',
            Accept : 'application/octet-stream'
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, 'payload');

    const instance = blobService(request, hostnameResolver, fs);

    instance.download('store', 'path').then((res) => {
        expect(res).toEqual('payload');

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const deleteRequestError = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveBlob').once().returns('http://blob.store');

    const requestMock = sinon.mock(request);
    requestMock.expects('delete').once().withArgs('http://blob.store/store/path', {
        headers : {
            Authorization : 'Bearer token',
            Accept : 'application/json'
        }
    }).callsArgWith(2, new Error('oh no'));

    const instance = blobService(request, hostnameResolver, fs);

    instance.delete('store', 'path', 'token').catch((err) => {
        expect(err).toEqual(new Error('oh no'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const deleteInvalidStatusCode = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveBlob').once().returns('http://blob.store');

    const requestMock = sinon.mock(request);
    requestMock.expects('delete').once().withArgs('http://blob.store/store/path', {
        headers : {
            Authorization : 'Bearer token',
            Accept : 'application/json'
        }
    }).callsArgWith(2, null, {
        statusCode : 404
    });

    const instance = blobService(request, hostnameResolver, fs);

    instance.delete('store', 'path', 'token').catch((err) => {
        expect(err).toEqual(new Error('Invalid status code returned: 404'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const deleteAutoAccessToken = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveBlob').once().returns('http://blob.store');

    const requestMock = sinon.mock(request);
    requestMock.expects('delete').once().withArgs('http://blob.store/store/path', {
        headers : {
            Authorization : 'Bearer auto_token',
            Accept : 'application/json'
        }
    }).callsArgWith(2, null, {
        statusCode : 204
    });

    const authClientProviderMock = sinon.mock(authClientProvider);
    authClientProviderMock.expects('getAccessToken').once().returns(Promise.resolve('auto_token'));

    const instance = blobService(request, hostnameResolver, fs);
    instance.setAuthClientProvider(authClientProvider);

    instance.delete('store', 'path').then(() => {
        hostnameMock.verify();
        requestMock.verify();
        authClientProviderMock.verify();

        done();
    });
};

const deleteUndefinedAuthClientProvider = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveBlob').once().returns('http://blob.store');

    const requestMock = sinon.mock(request);
    requestMock.expects('delete').once().withArgs('http://blob.store/store/path', {
        headers : {
            Authorization : 'Bearer ',
            Accept : 'application/json'
        }
    }).callsArgWith(2, null, {
        statusCode : 204
    });

    const instance = blobService(request, hostnameResolver, fs);

    instance.delete('store', 'path').then(() => {
        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

describe('A blob service', () => {
    it('supports constructor defaulting', constructorTest);

    describe('details', () => {
        it('handles request errors', detailsRequestError);
        it('handles invalid status codes', detailsInvalidStatusCode);
        it('handles invalid JSON body', detailsInvalidResponse);
        it('automatically determines access tokens', detailsAutoAccessToken);
        it('handles an undefined authClientProvider', detailsUndefinedAuthClientProvider);
    });

    describe('upload', () => {
        it('handles request errors', uploadRequestError);
        it('handles invalid status codes', uploadInvalidStatusCode);
        it('automatically determines access tokens', uploadAutoAccessToken);
        it('handles an undefined authClientProvider', uploadUndefinedAuthClientProvider);
        it('supports temporary files', uploadTemporaryFiles);
    })

    describe('download', () => {
        it('handles request errors', downloadRequestError);
        it('handles invalid status codes', downloadInvalidStatusCode);
        it('automatically determines access tokens', downloadAutoAccessToken);
        it('handles an undefined authClientProvider', downloadUndefinedAuthClientProvider);
    });

    describe('delete', () => {
        it('handles request errors', deleteRequestError);
        it('handles invalid status codes', deleteInvalidStatusCode);
        it('automatically determines access tokens', deleteAutoAccessToken);
        it('handles an undefined authClientProvider', deleteUndefinedAuthClientProvider);
    });
});