const
    sinon 			= require('sinon'),
    controller 		= require('../../../src/service.kernel/controllers/integrationsController');

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
    expect(instance.path).not.toBe(null);
    expect(instance.fileLister).not.toBe(null);
    expect(instance.roleCheckHandler).not.toBe(null);
    expect(instance.typeValidator).not.toBe(null);
    done();
};

const getGlobExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', '**/*.json').returns('search-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('search-path').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler, typeValidator);

    instance.get({}, {
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

const getTest = (done) => {
        const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', '**/*.json').returns('search-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('search-path').returns(Promise.resolve(['something']));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler, typeValidator);

    instance.get({}, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual(['something']);
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const getSingularReadErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('my-dir', 'my-name.json').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler, typeValidator);

    instance.getSingular({
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
                    'Error: oops'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const getSingularTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('my-dir', 'my-name.json').returns(Promise.resolve('some-content'));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler, typeValidator);

    instance.getSingular({
        params : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual('some-content');
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const updateValidationErrorTest = (done) => {
    const validatorMock = sinon.mock(typeValidator);
    validatorMock.expects('validate').once().withArgs('integration', {
        name : 'my-name'
    }).returns(Promise.reject(['not good']));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler, typeValidator);

    instance.update({
        body : {
            name : 'my-name'
        },
        params : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(422);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'not good'
                ]
            });
        },
        end : () => {
            validatorMock.verify();

            done();
        }
    });
};

const updateFileWriteErrorTest = (done) => {
    const validatorMock = sinon.mock(typeValidator);
    validatorMock.expects('validate').once().withArgs('integration', {
        name : 'my-name'
    }).returns(Promise.resolve());

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-name.json').returns(Promise.reject(new Error('really not good')));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler, typeValidator);

    instance.update({
        body : {
            name : 'my-name'
        },
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
                    'Error: really not good'
                ]
            });
        },
        end : () => {
            validatorMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const updateTest = (done) => {
    const validatorMock = sinon.mock(typeValidator);
    validatorMock.expects('validate').once().withArgs('integration', {
        name : 'my-name'
    }).returns(Promise.resolve());

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-name.json').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler, typeValidator);

    instance.update({
        body : {
            name : 'my-name'
        },
        params : {
            name : 'my-name'
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

const updateRenameTest = (done) => {
    const validatorMock = sinon.mock(typeValidator);
    validatorMock.expects('validate').once().withArgs('integration', {
        name : 'my-name'
    }).returns(Promise.resolve());

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('my-dir', 'my-name.json').returns(Promise.resolve());
    fileMock.expects('writeFile').once().withArgs('my-dir', 'new-name.json').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler, typeValidator);

    instance.update({
        body : {
            name : 'new-name'
        },
        params : {
            name : 'my-name'
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


const deleteErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('my-dir', 'my-name.json').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler, typeValidator);

    instance.delete({
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
                    'Error: oops'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const deleteTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('my-dir', 'my-name.json').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler, typeValidator);

    instance.delete({
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

const createValidationErrorTest = (done) => {
    const validatorMock = sinon.mock(typeValidator);
    validatorMock.expects('validate').once().withArgs('integration', {
        hello : 'world',
        name : 'my-name'
    }).returns(Promise.reject(['not good']));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler, typeValidator);

    instance.create({
        body : {
            hello : 'world',
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(422);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'not good'
                ]
            });
        },
        end : () => {
            validatorMock.verify();

            done();
        }
    });
};

const createFileWriteErrorTest = (done) => {
    const validatorMock = sinon.mock(typeValidator);
    validatorMock.expects('validate').once().withArgs('integration', {
        hello : 'world',
        name : 'my-name'
    }).returns(Promise.resolve());

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-name.json').returns(Promise.reject(new Error('really not good')));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler, typeValidator);

    instance.create({
        body : {
            hello : 'world',
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: really not good'
                ]
            });
        },
        end : () => {
            validatorMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const createTest = (done) => {
    const validatorMock = sinon.mock(typeValidator);
    validatorMock.expects('validate').once().withArgs('integration', {
        hello : 'world',
        name : 'my-name'
    }).returns(Promise.resolve());

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-name.json').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler, typeValidator);

    instance.create({
        body : {
            hello : 'world',
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(201);
        },
        location : (value) => {
            expect(value).toEqual('/integrations/my-name');
        },
        end : () => {
            validatorMock.verify();
            fileMock.verify();

            done();
        }
    });
};

describe('An integrations controller', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('get', () => {
        it('handles glob exceptions', getGlobExceptionTest);
        it('works', getTest);
    });

    describe('get singular', () => {
        it('handles read errors', getSingularReadErrorTest);
        it('works', getSingularTest);
    });

    describe('update', () => {
        it('handles validation errors', updateValidationErrorTest);
        it('handles file write errors', updateFileWriteErrorTest);
        it('works', updateTest);
        it('works when renaming', updateRenameTest);
    });

    describe('delete', () => {
        it('handles deletion errors', deleteErrorTest);
        it('works', deleteTest);
    });

    describe('create', () => {
        it('handles validation errors', createValidationErrorTest);
        it('handles file write errors', createFileWriteErrorTest);
        it('works', createTest);
    });
});