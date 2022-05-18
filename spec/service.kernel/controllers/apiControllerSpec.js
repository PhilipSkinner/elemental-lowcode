const
    sinon 			= require('sinon'),
    controller 		= require('../../../src/service.kernel/controllers/apiController');

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

const constructorTest = (done) => {
    const instance = controller();
    expect(instance.fileLister).not.toBe(null);
    expect(instance.roleCheckHandler).not.toBe(null);
    expect(instance.path).not.toBe(null);
    done();
};

const getApisTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', '**/*.api.json').returns('my-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('my-path').returns(Promise.resolve([
        {
            path : 'the-path',
            basename : 'the-basename',
            name : 'my.api'
        }
    ]));

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path);

    instance.getApis({}, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual([
                {
                    path : 'the-path',
                    basename : 'the-basename',
                    name : 'my'
                }
            ]);
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    }, () => {

    });
};

const getApisExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', '**/*.api.json').returns('my-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('my-path').returns(Promise.reject(new Error('oh noes')));

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path);

    instance.getApis({}, {
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
            pathMock.verify();
            fileMock.verify();

            done();
        }
    }, () => {

    });
};

const getApiTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('my-dir', 'my-api.api.json').returns(Promise.resolve('the-content'));

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path);

    instance.getApi({
        params : {
            name : 'my-api'
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
    }, () => {

    });
};

const getApiExceptionTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('my-dir', 'my-api.api.json').returns(Promise.reject(new Error('not today')));

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path);

    instance.getApi({
        params : {
            name : 'my-api'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: not today'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    }, () => {

    });
};

const getControllerTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', 'my-api', '/controllers/').returns('controller-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readFile').once().withArgs('controller-path', 'controller-name').returns(Promise.resolve('controller-code'));

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path);

    instance.getController({
        params : {
            name : 'my-api',
            controller: 'controller-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        send : (data) => {
            expect(data).toEqual('controller-code');
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    }, () => {

    });
};

const getControllerExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', 'my-api', '/controllers/').returns('controller-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readFile').once().withArgs('controller-path', 'controller-name').returns(Promise.reject(new Error('not today')));

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path);

    instance.getController({
        params : {
            name : 'my-api',
            controller : 'controller-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: not today'
                ]
            });
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    }, () => {

    });
};

const createApiTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-api.api.json').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path);

    instance.createApi({
        body : {
            name : 'my-api',
            hello : 'world'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(201);
        },
        location : (value) => {
            expect(value).toEqual('/apis/my-api');
        },
        end : () => {
            fileMock.verify();

            done();
        }
    }, () => {

    });
};

const createApiExceptionTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-api.api.json').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path);

    instance.createApi({
        body : {
            name : 'my-api',
            hello : 'world'
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
            })
        },
        end : () => {
            fileMock.verify();

            done();
        }
    }, () => {

    });
};

const createControllerTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', 'my-api', '/controllers/').returns('controller-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('controller-path', 'controller-name', 'controller-content').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path);

    instance.createController({
        params : {
            name : 'my-api'
        },
        body : {
            name : 'controller-name',
            content : 'controller-content'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(201);
        },
        location : (value) => {
            expect(value).toEqual('/apis/my-api/controllers/controller-name');
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    }, () => {

    });
};

const createControllerExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', 'my-api', '/controllers/').returns('controller-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('controller-path', 'controller-name', 'controller-content').returns(Promise.reject(new Error('not today')));

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path);

    instance.createController({
        params : {
            name : 'my-api'
        },
        body : {
            name : 'controller-name',
            content : 'controller-content'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: not today'
                ]
            });
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    }, () => {

    });
};

const updateApiTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-api.api.json').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path);

    instance.updateApi({
        body : {
            name : 'my-api',
            hello : 'world'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            fileMock.verify();

            done();
        }
    }, () => {

    });
};

const updateApiExceptionTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-api.api.json').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path);

    instance.updateApi({
        body : {
            name : 'my-api',
            hello : 'world'
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
            })
        },
        end : () => {
            fileMock.verify();

            done();
        }
    }, () => {

    });
};

const updateControllerTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', 'my-api', '/controllers/').returns('controller-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('controller-path', 'controller-name', 'controller-content').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path);

    instance.updateController({
        params : {
            name : 'my-api',
            controller : 'controller-name'
        },
        body : {
            name : 'controller-name',
            content : 'controller-content'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    }, () => {

    });
};

const updateControllerExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', 'my-api', '/controllers/').returns('controller-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('controller-path', 'controller-name', 'controller-content').returns(Promise.reject(new Error('not today')));

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path);

    instance.updateController({
        params : {
            name : 'my-api',
            controller : 'controller-name'
        },
        body : {
            name : 'controller-name',
            content : 'controller-content'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: not today'
                ]
            });
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    }, () => {

    });
};

const deleteApiTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('my-dir', 'my-api.api.json').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path);

    instance.deleteApi({
        params : {
            name : 'my-api'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            fileMock.verify();

            done();
        }
    }, () => {

    });
};

const deleteApiExceptionTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('my-dir', 'my-api.api.json').returns(Promise.reject());

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path);

    instance.deleteApi({
        params : {
            name : 'my-api'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(404);
        },
        end : () => {
            fileMock.verify();

            done();
        }
    }, () => {

    });
};

const deleteControllerTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', 'my-api', '/controllers/').returns('controller-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('controller-path', 'controller-name').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path);

    instance.deleteController({
        params : {
            name : 'my-api',
            controller : 'controller-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    }, () => {

    });
};

const deleteControllerExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', 'my-api', '/controllers/').returns('controller-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('controller-path', 'controller-name').returns(Promise.reject());

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler, path);

    instance.deleteController({
        params : {
            name : 'my-api',
            controller : 'controller-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(404);
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    }, () => {

    });
};

describe('An api controller', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('get apis', () => {
        it('can get a list of apis', getApisTest);
        it('can handle exceptions', getApisExceptionTest);
    });

    describe('get api', () => {
        it('can get an api', getApiTest);
        it('can handle exceptions', getApiExceptionTest);
    });

    describe('get controller', () => {
        it('can get a controller', getControllerTest);
        it('can handle exceptions', getControllerExceptionTest);
    });

    describe('create api', () => {
        it('can create an api', createApiTest);
        it('can handle exceptions', createApiExceptionTest);
    });

    describe('create controller', () => {
        it('can create a controller', createControllerTest);
        it('can handle exceptions', createControllerExceptionTest);
    });

    describe('update api', () => {
        it('can update an api', updateApiTest);
        it('can handle exceptions', updateApiExceptionTest);
    });

    describe('update controller', () => {
        it('can update a controller', updateControllerTest);
        it('can handle exceptions', updateControllerExceptionTest);
    });

    describe('delete api', () => {
        it('can delete an api', deleteApiTest);
        it('can handle exceptions', deleteApiExceptionTest);
    });

    describe('delete controller', () => {
        it('can delete a controller', deleteControllerTest);
        it('can handle exceptions', deleteControllerExceptionTest);
    });
});