const
    jasmine 		= require('jasmine'),
    sinon 			= require('sinon'),
    storageService 	= require('../../src/support.lib/storageService');

const request = {
    get : () => {},
    post : () => {},
    put : () => {},
    patch : () => {},
    delete : () => {}
};

const hostnameResolver = {
    resolveStorage : () => {}
};

const authClientProvider = {
    getAccessToken : () => {}
};

const constructorTest = (done) => {
    const instance = storageService();
    expect(instance.request).not.toBe(null);
    done();
};

const detailCollectionTest = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://storage/collection/.details', {
        headers : {
            Authorization : 'Bearer '
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, '{"hello":"world"}');

    const instance = storageService(request, hostnameResolver);

    instance.detailCollection('collection', null).then((response) => {
        expect(response).toEqual({
            hello : "world"
        });

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const detailCollectionInvalidJSON = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://storage/collection/.details', {
        headers : {
            Authorization : 'Bearer '
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, '{}SD{}D}A{WD}{WAD}{AWD{A}WD}}');

    const instance = storageService(request, hostnameResolver);

    instance.detailCollection('collection', null).catch((err) => {
        expect(err).toEqual(new Error('Invalid response received from collection details'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const detailCollectionInvalidStatusCode = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://storage/collection/.details', {
        headers : {
            Authorization : 'Bearer '
        }
    }).callsArgWith(2, null, {
        statusCode : 500
    }, 'oops');

    const instance = storageService(request, hostnameResolver);

    instance.detailCollection('collection', null).catch((err) => {
        expect(err).toEqual('oops');

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const detailCollectionRequestError = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://storage/collection/.details', {
        headers : {
            Authorization : 'Bearer '
        }
    }).callsArgWith(2, new Error('oops'));

    const instance = storageService(request, hostnameResolver);

    instance.detailCollection('collection', null).catch((err) => {
        expect(err).toEqual(new Error('oops'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const detailCollectionAuthToken = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://storage/collection/.details', {
        headers : {
            Authorization : 'Bearer my token'
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, '{"hello":"world"}');

    const instance = storageService(request, hostnameResolver);

    instance.detailCollection('collection', 'my token').then((response) => {
        expect(response).toEqual({
            hello : "world"
        });

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const detailCollectionAuthProvider = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://storage/collection/.details', {
        headers : {
            Authorization : 'Bearer a token'
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, '{"hello":"world"}');

    const authClientProviderMock = sinon.mock(authClientProvider);
    authClientProviderMock.expects('getAccessToken').once().returns(Promise.resolve('a token'));

    const instance = storageService(request, hostnameResolver);
    instance.setAuthClientProvider(authClientProvider);

    instance.detailCollection('collection').then((response) => {
        expect(response).toEqual({
            hello : "world"
        });

        authClientProviderMock.verify();
        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const getListTest = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://storage/collection', {
        headers : {
            Authorization : 'Bearer '
        },
        qs : {
            start : undefined,
            count : undefined
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, '{"hello":"world"}');

    const instance = storageService(request, hostnameResolver);

    instance.getList('collection').then((response) => {
        expect(response).toEqual({
            hello : "world"
        });

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const getListFilterTest = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://storage/collection', {
        headers : {
            Authorization : 'Bearer '
        },
        qs : {
            start : 1,
            count : 10,
            filter_something : "this"
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, '{"hello":"world"}');

    const instance = storageService(request, hostnameResolver);

    instance.getList('collection', 1, 10, {
        something : "this"
    }).then((response) => {
        expect(response).toEqual({
            hello : "world"
        });

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const getListOrderTest = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://storage/collection', {
        headers : {
            Authorization : 'Bearer '
        },
        qs : {
            start : 1,
            count : 10,
            order_something : "this"
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, '{"hello":"world"}');

    const instance = storageService(request, hostnameResolver);

    instance.getList('collection', 1, 10, null, {
        something : "this"
    }).then((response) => {
        expect(response).toEqual({
            hello : "world"
        });

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const getListInvalidJSON = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://storage/collection', {
        headers : {
            Authorization : 'Bearer '
        },
        qs : {
            start : undefined,
            count : undefined
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, 'SDLKALOWDAWDAW}{D}AW{D}A{WD}{WA}D{W');

    const instance = storageService(request, hostnameResolver);

    instance.getList('collection').catch((err) => {
        expect(err).toEqual(new Error('Invalid response received from getting list of results'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const getListInvalidStatusCode = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://storage/collection', {
        headers : {
            Authorization : 'Bearer '
        },
        qs : {
            start : undefined,
            count : undefined
        }
    }).callsArgWith(2, null, {
        statusCode : 500
    }, 'oops');

    const instance = storageService(request, hostnameResolver);

    instance.getList('collection').catch((err) => {
        expect(err).toEqual('oops');

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const getListRequestError = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://storage/collection', {
        headers : {
            Authorization : 'Bearer '
        },
        qs : {
            start : undefined,
            count : undefined
        }
    }).callsArgWith(2, new Error('oops'));

    const instance = storageService(request, hostnameResolver);

    instance.getList('collection').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const getListAuthToken = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://storage/collection', {
        headers : {
            Authorization : 'Bearer my token'
        },
        qs : {
            start : 1,
            count : 10
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, '{"hello":"world"}');

    const instance = storageService(request, hostnameResolver);

    instance.getList('collection', 1, 10, null, null, 'my token').then((response) => {
        expect(response).toEqual({
            hello : "world"
        });

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const getListAuthProvider = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://storage/collection', {
        headers : {
            Authorization : 'Bearer a token'
        },
        qs : {
            start : undefined,
            count : undefined
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, '{"hello":"world"}');

    const authClientProviderMock = sinon.mock(authClientProvider);
    authClientProviderMock.expects('getAccessToken').once().returns(Promise.resolve('a token'));

    const instance = storageService(request, hostnameResolver);
    instance.setAuthClientProvider(authClientProvider);

    instance.getList('collection').then((response) => {
        expect(response).toEqual({
            hello : "world"
        });

        authClientProviderMock.verify();
        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const getEntityTest = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://storage/collection/id', {
        headers : {
            Authorization : 'Bearer '
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, '{"hello":"world"}');

    const instance = storageService(request, hostnameResolver);

    instance.getEntity('collection', 'id').then((response) => {
        expect(response).toEqual({
            id : "id",
            hello : "world"
        });

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const getEntityInvalidJSON = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://storage/collection/id', {
        headers : {
            Authorization : 'Bearer '
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, 'SDIOWOAIDWD{}E{F}W{}A{WDAWD:AW@');

    const instance = storageService(request, hostnameResolver);

    instance.getEntity('collection', 'id').catch((err) => {
        expect(err).toEqual(new Error('Invalid response received when fetching entity'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const getEntityInvalidStatusCode = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://storage/collection/id', {
        headers : {
            Authorization : 'Bearer '
        }
    }).callsArgWith(2, null, {
        statusCode : 500
    }, 'oops');

    const instance = storageService(request, hostnameResolver);

    instance.getEntity('collection', 'id').catch((err) => {
        expect(err).toEqual('oops');

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const getEntityRequestError = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://storage/collection/id', {
        headers : {
            Authorization : 'Bearer '
        }
    }).callsArgWith(2, new Error('oops'));

    const instance = storageService(request, hostnameResolver);

    instance.getEntity('collection', 'id').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const getEntityAuthToken = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://storage/collection/id', {
        headers : {
            Authorization : 'Bearer my token'
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, '{"hello":"world"}');

    const instance = storageService(request, hostnameResolver);

    instance.getEntity('collection', 'id', 'my token').then((response) => {
        expect(response).toEqual({
            id : "id",
            hello : "world"
        });

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const getEntityAuthProvider = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('get').once().withArgs('http://storage/collection/id', {
        headers : {
            Authorization : 'Bearer a token'
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, '{"hello":"world"}');

    const authClientProviderMock = sinon.mock(authClientProvider);
    authClientProviderMock.expects('getAccessToken').once().returns(Promise.resolve('a token'));

    const instance = storageService(request, hostnameResolver);
    instance.setAuthClientProvider(authClientProvider);

    instance.getEntity('collection', 'id').then((response) => {
        expect(response).toEqual({
            id : "id",
            hello : "world"
        });

        authClientProviderMock.verify();
        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const createEntityTest = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').twice().returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://storage/collection', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer ',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, null, {
        statusCode : 201,
        headers : {
            location : '/collection/id'
        }
    }, '{"hello":"world"}');
    requestMock.expects('get').once().withArgs('http://storage/collection/id', {
        headers : {
            Authorization : 'Bearer '
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, '{"hello":"world"}');

    const instance = storageService(request, hostnameResolver);

    instance.createEntity('collection', 'my-entity').then((response) => {
        expect(response).toEqual({
            id : "id",
            hello : "world"
        });

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const createEntityInvalidStatusCode = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').once().returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://storage/collection', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer ',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, null, {
        statusCode : 500,
    }, 'oops');

    const instance = storageService(request, hostnameResolver);

    instance.createEntity('collection', 'my-entity').catch((err) => {
        expect(err).toEqual('oops');

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const createEntityRequestError = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').once().returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://storage/collection', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer ',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, new Error('oops'));

    const instance = storageService(request, hostnameResolver);

    instance.createEntity('collection', 'my-entity').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const createEntityAuthToken = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').once().returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://storage/collection', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer my token',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, new Error('oops'));

    const instance = storageService(request, hostnameResolver);

    instance.createEntity('collection', 'my-entity', 'my token').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const createEntityAuthProvider = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').once().returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://storage/collection', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer a token',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, new Error('oops'));

    const authClientProviderMock = sinon.mock(authClientProvider);
    authClientProviderMock.expects('getAccessToken').once().returns(Promise.resolve('a token'));

    const instance = storageService(request, hostnameResolver);
    instance.setAuthClientProvider(authClientProvider);

    instance.createEntity('collection', 'my-entity').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        authClientProviderMock.verify();
        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const updateEntityTest = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('put').once().withArgs('http://storage/collection/id', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer ',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, null, {
        statusCode : 204
    });

    const instance = storageService(request, hostnameResolver);

    instance.updateEntity('collection', 'id', 'my-entity').then(() => {
        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const updateEntityInvalidStatusCode = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('put').once().withArgs('http://storage/collection/id', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer ',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, null, {
        statusCode : 500
    }, 'oops');

    const instance = storageService(request, hostnameResolver);

    instance.updateEntity('collection', 'id', 'my-entity').catch((err) => {
        expect(err).toEqual('oops');

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const updateEntityRequestError = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('put').once().withArgs('http://storage/collection/id', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer ',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, new Error('oops'));

    const instance = storageService(request, hostnameResolver);

    instance.updateEntity('collection', 'id', 'my-entity').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const updateEntityAuthToken = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('put').once().withArgs('http://storage/collection/id', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer my token',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, new Error('oops'));

    const instance = storageService(request, hostnameResolver);

    instance.updateEntity('collection', 'id', 'my-entity', 'my token').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const updateEntityAuthProvider = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('put').once().withArgs('http://storage/collection/id', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer a token',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, new Error('oops'));

    const authClientProviderMock = sinon.mock(authClientProvider);
    authClientProviderMock.expects('getAccessToken').once().returns(Promise.resolve('a token'));

    const instance = storageService(request, hostnameResolver);
    instance.setAuthClientProvider(authClientProvider);

    instance.updateEntity('collection', 'id', 'my-entity').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        authClientProviderMock.verify();
        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const patchEntityTest = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('patch').once().withArgs('http://storage/collection/id', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer ',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, null, {
        statusCode : 204
    });

    const instance = storageService(request, hostnameResolver);

    instance.patchEntity('collection', 'id', 'my-entity').then(() => {
        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const patchEntityInvalidStatusCode = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('patch').once().withArgs('http://storage/collection/id', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer ',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, null, {
        statusCode : 500
    }, 'oops');

    const instance = storageService(request, hostnameResolver);

    instance.patchEntity('collection', 'id', 'my-entity').catch((err) => {
        expect(err).toEqual('oops');

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const patchEntityRequestError = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('patch').once().withArgs('http://storage/collection/id', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer ',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, new Error('oops'));

    const instance = storageService(request, hostnameResolver);

    instance.patchEntity('collection', 'id', 'my-entity').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const patchEntityAuthToken = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('patch').once().withArgs('http://storage/collection/id', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer my token',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, new Error('oops'));

    const instance = storageService(request, hostnameResolver);

    instance.patchEntity('collection', 'id', 'my-entity', 'my token').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const patchEntityAuthProvider = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('patch').once().withArgs('http://storage/collection/id', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer a token',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, new Error('oops'));

    const authClientProviderMock = sinon.mock(authClientProvider);
    authClientProviderMock.expects('getAccessToken').once().returns(Promise.resolve('a token'));

    const instance = storageService(request, hostnameResolver);
    instance.setAuthClientProvider(authClientProvider);

    instance.patchEntity('collection', 'id', 'my-entity').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        authClientProviderMock.verify();
        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const deleteEntityTest = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('delete').once().withArgs('http://storage/collection/id', {
        headers : {
            Authorization : 'Bearer '
        }
    }).callsArgWith(2, null, {
        statusCode : 204
    });

    const instance = storageService(request, hostnameResolver);

    instance.deleteEntity('collection', 'id').then(() => {
        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const deleteEntityInvalidStatusCode = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('delete').once().withArgs('http://storage/collection/id', {
        headers : {
            Authorization : 'Bearer '
        }
    }).callsArgWith(2, null, {
        statusCode : 500
    }, 'oops');

    const instance = storageService(request, hostnameResolver);

    instance.deleteEntity('collection', 'id').catch((err) => {
        expect(err).toEqual('oops');

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const deleteEntityRequestError = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('delete').once().withArgs('http://storage/collection/id', {
        headers : {
            Authorization : 'Bearer '
        }
    }).callsArgWith(2, new Error('oops'));

    const instance = storageService(request, hostnameResolver);

    instance.deleteEntity('collection', 'id').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const deleteEntityAuthToken = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('delete').once().withArgs('http://storage/collection/id', {
        headers : {
            Authorization : 'Bearer my token'
        }
    }).callsArgWith(2, new Error('oops'));

    const instance = storageService(request, hostnameResolver);

    instance.deleteEntity('collection', 'id', 'my token').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const deleteEntityAuthProvider = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveStorage').returns('http://storage');

    const requestMock = sinon.mock(request);
    requestMock.expects('delete').once().withArgs('http://storage/collection/id', {
        headers : {
            Authorization : 'Bearer a token'
        }
    }).callsArgWith(2, new Error('oops'));

    const authClientProviderMock = sinon.mock(authClientProvider);
    authClientProviderMock.expects('getAccessToken').once().returns(Promise.resolve('a token'));

    const instance = storageService(request, hostnameResolver);
    instance.setAuthClientProvider(authClientProvider);

    instance.deleteEntity('collection', 'id').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        authClientProviderMock.verify();
        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

describe('A storage service client', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('detail collection', () => {
        it('works', detailCollectionTest);
        it('handles invalid JSON', detailCollectionInvalidJSON);
        it('handles invalid status codes', detailCollectionInvalidStatusCode);
        it('handles request errors', detailCollectionRequestError);
        it('handles a given auth token', detailCollectionAuthToken);
        it('uses the auth provider', detailCollectionAuthProvider);
    });

    describe('get list', () => {
        it('works', getListTest);
        it('supports filters', getListFilterTest);
        it('supports orders', getListOrderTest);
        it('handles invalid JSON', getListInvalidJSON);
        it('handles invalid status codes', getListInvalidStatusCode);
        it('handles request errors', getListRequestError);
        it('handles a given auth token', getListAuthToken);
        it('uses the auth provider', getListAuthProvider);
    });

    describe('get entity', () => {
        it('works', getEntityTest);
        it('handles invalid JSON', getEntityInvalidJSON);
        it('handles invalid status codes', getEntityInvalidStatusCode);
        it('handles request errors', getEntityRequestError);
        it('handles a given auth token', getEntityAuthToken);
        it('uses the auth provider', getEntityAuthProvider);
    });

    describe('create entity', () => {
        it('works', createEntityTest);
        it('handles invalid status codes', createEntityInvalidStatusCode);
        it('handles request errors', createEntityRequestError);
        it('handles a given auth token', createEntityAuthToken);
        it('uses the auth provider', createEntityAuthProvider);
    });

    describe('update entity', () => {
        it('works', updateEntityTest);
        it('handles invalid status codes', updateEntityInvalidStatusCode);
        it('handles request errors', updateEntityRequestError);
        it('handles a given auth token', updateEntityAuthToken);
        it('uses the auth provider', updateEntityAuthProvider);
    });

    describe('patch entity', () => {
        it('works', patchEntityTest);
        it('handles invalid status codes', patchEntityInvalidStatusCode);
        it('handles request errors', patchEntityRequestError);
        it('handles a given auth token', patchEntityAuthToken);
        it('uses the auth provider', patchEntityAuthProvider);
    });

    describe('delete entity', () => {
        it('works', deleteEntityTest);
        it('handles invalid status codes', deleteEntityInvalidStatusCode);
        it('handles request errors', deleteEntityRequestError);
        it('handles a given auth token', deleteEntityAuthToken);
        it('uses the auth provider', deleteEntityAuthProvider);
    });
});
