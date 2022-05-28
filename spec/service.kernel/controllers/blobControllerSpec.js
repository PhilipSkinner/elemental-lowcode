const
    sinon           = require('sinon'),
    controller      = require('../../../src/service.kernel/controllers/blobController');

const app = {
    get : () => {},
    post : () => {},
    put : () => {},
    delete : () => {}
};

const fileLister = {
    executeGlob : () => {},
    readJSONFile : () => {},
    readFile : () => {},
    writeFile : () => {},
    deleteFile : () => {},
};

const roleCheckHandler = {
    enforceRoles : () => {}
};

const path = {
    join : () => {}
};

const typeValidator = {
    validate : () => {}
};

const constructorTest = (done) => {
    const instance = controller();
    expect(instance.fileLister).not.toBe(null);
    expect(instance.roleCheckHandler).not.toBe(null);
    expect(instance.path).not.toBe(null);
    expect(instance.typeValidator).not.toBe(null);
    done();
};

const getStoresGlobExceptions = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', '**/*.store.json').returns('search-dir');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('search-dir').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path, typeValidator);

    instance.getStores({}, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oops'
                ]
            });
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();
            done();
        }
    });
};


const getStoresTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', '**/*.store.json').returns('search-dir');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('search-dir').returns(Promise.resolve([{ name : 'my-file.store' }]));

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path, typeValidator);

    instance.getStores({
        headers : {
            authorization : 'Bearer of arms'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual([
                {
                    name : 'my-file'
                }
            ]);
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const getStoreExceptionTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('my-dir', 'data-type.store.json').returns(Promise.reject(new Error('oh noes')));

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path, typeValidator);

    instance.getStore({
        params : {
            name : 'data-type'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oh noes'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const getStoreTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('my-dir', 'data-type.store.json').returns(Promise.resolve('the-content'));

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path, typeValidator);

    instance.getStore({
        params : {
            name : 'data-type'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual('the-content');
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const updateStoreValidatorErrors = (done) => {
    const validatorMock = sinon.mock(typeValidator);
    validatorMock.expects('validate').once().withArgs('blobstore', {
        name : 'name',
        hello : 'world'
    }).returns(Promise.reject(['some errors']));

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path, typeValidator);

    instance.updateStore({
        params : {
            name : 'name'
        },
        body : {
            name : 'name',
            hello : 'world'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(422);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : ['some errors']
            });
        },
        end : () => {
            validatorMock.verify();

            done();
        }
    });
};

const updateStoreWriteFileErrors = (done) => {
    const validatorMock = sinon.mock(typeValidator);
    validatorMock.expects('validate').once().withArgs('blobstore', {
        name : 'my-name',
        hello : 'world'
    }).returns(Promise.resolve());

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-name.store.json').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path, typeValidator);

    instance.updateStore({
        params : {
            name : 'my-name'
        },
        body : {
            name : 'my-name',
            hello : 'world'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : ['Error: oops']
            });
        },
        end : () => {
            validatorMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const updateStoreTest = (done) => {
    const validatorMock = sinon.mock(typeValidator);
    validatorMock.expects('validate').once().withArgs('blobstore', {
        name : 'my-name',
        hello : 'world'
    }).returns(Promise.resolve());

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-name.store.json').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path, typeValidator);

    instance.updateStore({
        params : {
            name : 'my-name'
        },
        body : {
            name : 'my-name',
            hello : 'world'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            validatorMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const deleteStoreExceptions = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('my-dir', 'my-name.store.json').returns(Promise.reject(new Error('not good')));

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path, typeValidator);

    instance.deleteStore({
        params : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: not good'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const deleteStoreTest = (done) => {
        const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('my-dir', 'my-name.store.json').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path, typeValidator);

    instance.deleteStore({
        params : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const createStoreValidatorErrors = (done) => {
    const validatorMock = sinon.mock(typeValidator);
    validatorMock.expects('validate').once().withArgs('blobstore', {
        name : 'my-name',
        hello : 'world'
    }).returns(Promise.reject(['some errors']));

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path, typeValidator);

    instance.createStore({
        body : {
            name : 'my-name',
            hello : 'world'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(422);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : ['some errors']
            });
        },
        end : () => {
            validatorMock.verify();

            done();
        }
    });
};

const createStoreWriteFileErrors = (done) => {
    const validatorMock = sinon.mock(typeValidator);
    validatorMock.expects('validate').once().withArgs('blobstore', {
        name : 'my-name',
        hello : 'world'
    }).returns(Promise.resolve());

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-name.store.json').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path, typeValidator);

    instance.createStore({
        body : {
            name : 'my-name',
            hello : 'world'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : ['Error: oops']
            });
        },
        end : () => {
            validatorMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const createStoreTest = (done) => {
    const validatorMock = sinon.mock(typeValidator);
    validatorMock.expects('validate').once().withArgs('blobstore', {
        name : 'my-name',
        hello : 'world'
    }).returns(Promise.resolve());

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-name.store.json').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path, typeValidator);

    instance.createStore({
        body : {
            name : 'my-name',
            hello : 'world'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(201);
        },
        location : (value) => {
            expect(value).toEqual('/blob/stores/my-name');
        },
        end : () => {
            validatorMock.verify();
            fileMock.verify();

            done();
        }
    });
};

describe('A blob controller', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('get blob stores', () => {
        it('handles glob exceptions', getStoresGlobExceptions);
        it('works', getStoresTest);
    });

    describe('get blob store', () => {
        it('handles exceptions', getStoreExceptionTest);
        it('works', getStoreTest);
    });

    describe('update blob store', () => {
        it('handles validator errors', updateStoreValidatorErrors);
        it('handles write file errors', updateStoreWriteFileErrors);
        it('works', updateStoreTest);
    });

    describe('delete blob store', () => {
        it('handles exceptions', deleteStoreExceptions);
        it('works', deleteStoreTest);
    });

    describe('create blob store', () => {
        it('handles validator errors', createStoreValidatorErrors);
        it('handles write file errors', createStoreWriteFileErrors);
        it('works', createStoreTest);
    });
});