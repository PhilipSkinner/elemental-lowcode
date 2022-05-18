const
    sinon 			= require('sinon'),
    controller 		= require('../../../src/service.kernel/controllers/dataController');

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

const storageService = {
    detailCollection : () => {}
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
    expect(instance.storageService).not.toBe(null);
    expect(instance.roleCheckHandler).not.toBe(null);
    expect(instance.path).not.toBe(null);
    expect(instance.typeValidator).not.toBe(null);
    done();
};

const getDataTypesGlobExceptions = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', '**/*.json').returns('search-dir');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('search-dir').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', fileLister, storageService, roleCheckHandler, path, typeValidator);

    instance.getDataTypes({}, {
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

const getDataTypesStorageExceptions = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', '**/*.json').returns('search-dir');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('search-dir').returns(Promise.resolve([{ name : 'my-file' }]));

    const storageMock = sinon.mock(storageService);
    storageMock.expects('detailCollection').once().withArgs('my-file', 'of arms').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', fileLister, storageService, roleCheckHandler, path, typeValidator);

    instance.getDataTypes({
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
                    name : 'my-file',
                    count : 0
                }
            ]);
        },
        end : () => {
            storageMock.verify();
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const getDataTypesTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', '**/*.json').returns('search-dir');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('search-dir').returns(Promise.resolve([{ name : 'my-file' }]));

    const storageMock = sinon.mock(storageService);
    storageMock.expects('detailCollection').once().withArgs('my-file', 'of arms').returns(Promise.resolve({ count : 1234 }));

    const instance = controller(app, 'my-dir', fileLister, storageService, roleCheckHandler, path, typeValidator);

    instance.getDataTypes({
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
                    name : 'my-file',
                    count : 1234
                }
            ]);
        },
        end : () => {
            storageMock.verify();
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const getDataTypeExceptionTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('my-dir', 'data-type.json').returns(Promise.reject(new Error('oh noes')));

    const instance = controller(app, 'my-dir', fileLister, storageService, roleCheckHandler, path, typeValidator);

    instance.getDataType({
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

const getDataTypeTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('my-dir', 'data-type.json').returns(Promise.resolve('the-content'));

    const instance = controller(app, 'my-dir', fileLister, storageService, roleCheckHandler, path, typeValidator);

    instance.getDataType({
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

const updateDataTypeValidatorErrors = (done) => {
    const validatorMock = sinon.mock(typeValidator);
    validatorMock.expects('validate').once().withArgs('datatype', {
        hello : 'world'
    }).returns(Promise.reject(['some errors']));

    const instance = controller(app, 'my-dir', fileLister, storageService, roleCheckHandler, path, typeValidator);

    instance.updateDataType({
        body : {
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

const updateDataTypeWriteFileErrors = (done) => {
    const validatorMock = sinon.mock(typeValidator);
    validatorMock.expects('validate').once().withArgs('datatype', {
        hello : 'world'
    }).returns(Promise.resolve());

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-name.json').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', fileLister, storageService, roleCheckHandler, path, typeValidator);

    instance.updateDataType({
        params : {
            name : 'my-name'
        },
        body : {
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

const updateDataTypeTest = (done) => {
    const validatorMock = sinon.mock(typeValidator);
    validatorMock.expects('validate').once().withArgs('datatype', {
        hello : 'world'
    }).returns(Promise.resolve());

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-name.json').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, storageService, roleCheckHandler, path, typeValidator);

    instance.updateDataType({
        params : {
            name : 'my-name'
        },
        body : {
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

const deleteDataTypeExceptions = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('my-dir', 'my-name.json').returns(Promise.reject(new Error('not good')));

    const instance = controller(app, 'my-dir', fileLister, storageService, roleCheckHandler, path, typeValidator);

    instance.deleteDataType({
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

const deleteDataTypeTest = (done) => {
        const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('my-dir', 'my-name.json').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, storageService, roleCheckHandler, path, typeValidator);

    instance.deleteDataType({
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

const createDataTypeValidatorErrors = (done) => {
    const validatorMock = sinon.mock(typeValidator);
    validatorMock.expects('validate').once().withArgs('datatype', {
        name : 'my-name',
        hello : 'world'
    }).returns(Promise.reject(['some errors']));

    const instance = controller(app, 'my-dir', fileLister, storageService, roleCheckHandler, path, typeValidator);

    instance.createDataType({
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

const createDataTypeWriteFileErrors = (done) => {
    const validatorMock = sinon.mock(typeValidator);
    validatorMock.expects('validate').once().withArgs('datatype', {
        name : 'my-name',
        hello : 'world'
    }).returns(Promise.resolve());

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-name.json').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', fileLister, storageService, roleCheckHandler, path, typeValidator);

    instance.createDataType({
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

const createDataTypeTest = (done) => {
    const validatorMock = sinon.mock(typeValidator);
    validatorMock.expects('validate').once().withArgs('datatype', {
        name : 'my-name',
        hello : 'world'
    }).returns(Promise.resolve());

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-name.json').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, storageService, roleCheckHandler, path, typeValidator);

    instance.createDataType({
        body : {
            name : 'my-name',
            hello : 'world'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(201);
        },
        location : (value) => {
            expect(value).toEqual('/data/types/my-name');
        },
        end : () => {
            validatorMock.verify();
            fileMock.verify();

            done();
        }
    });
};

describe('A data controller', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('get data types', () => {
        it('handles glob exceptions', getDataTypesGlobExceptions);
        it('handles storage service exceptions', getDataTypesStorageExceptions);
        it('works', getDataTypesTest);
    });

    describe('get data type', () => {
        it('handles exceptions', getDataTypeExceptionTest);
        it('works', getDataTypeTest);
    });

    describe('update data type', () => {
        it('handles validator errors', updateDataTypeValidatorErrors);
        it('handles write file errors', updateDataTypeWriteFileErrors);
        it('works', updateDataTypeTest);
    });

    describe('delete data type', () => {
        it('handles exceptions', deleteDataTypeExceptions);
        it('works', deleteDataTypeTest);
    });

    describe('create data type', () => {
        it('handles validator errors', createDataTypeValidatorErrors);
        it('handles write file errors', createDataTypeWriteFileErrors);
        it('works', createDataTypeTest);
    });
});