const
    sinon 			= require('sinon'),
    controller 		= require('../../../src/service.kernel/controllers/queueController');

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
    expect(instance.path).not.toBe(null);
    expect(instance.roleCheckHandler).not.toBe(null);
    done();
};

const getGlobExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', '*.queue.json').returns('search-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('search-path').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler);

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
    pathMock.expects('join').once().withArgs('my-dir', '*.queue.json').returns('search-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('search-path').returns(Promise.resolve([{
        name : 'this is my name.queue'
    }]));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler);

    instance.get({}, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual([{
                name : 'this is my name'
            }]);
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
    fileMock.expects('readJSONFile').once().withArgs('my-dir', 'my-name.queue.json').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler);

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
    fileMock.expects('readJSONFile').once().withArgs('my-dir', 'my-name.queue.json').returns(Promise.resolve('some-content'));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler);

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

const updateFileWriteErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-name.queue.json').returns(Promise.reject(new Error('really not good')));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler);

    instance.update({
        body : 'my-body',
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
            fileMock.verify();

            done();
        }
    });
};

const updateTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-name.queue.json').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler);

    instance.update({
        body : 'my-body',
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

const deleteErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('my-dir', 'my-name.queue.json').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler);

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
    fileMock.expects('deleteFile').once().withArgs('my-dir', 'my-name.queue.json').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler);

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

const createFileWriteErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-name.queue.json').returns(Promise.reject(new Error('really not good')));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler);

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
            fileMock.verify();

            done();
        }
    });
};

const createTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-name.queue.json').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler);

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
            expect(value).toEqual('/queues/my-name');
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const getHandlerExceptionTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readFile').once().withArgs('my-dir', 'my-name.queue.js').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler);

    instance.getHandler({
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

const getHandlerTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readFile').once().withArgs('my-dir', 'my-name.queue.js').returns(Promise.resolve('some-content'));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler);

    instance.getHandler({
        params : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        send : (data) => {
            expect(data).toEqual('some-content');
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const setHandlerExceptionTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-name.queue.js', 'my-handler').returns(Promise.reject(new Error('really not good')));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler);

    instance.setHandler({
        params : {
            name : 'my-name'
        },
        body : {
            payload : 'my-handler'
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
            fileMock.verify();

            done();
        }
    });
};

const setHandlerTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-name.queue.js', 'my-handler').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler);

    instance.setHandler({
        params : {
            name : 'my-name'
        },
        body : {
            payload : 'my-handler'
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

describe('A queue controller', () => {
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
        it('handles file write errors', updateFileWriteErrorTest);
        it('works', updateTest);
    });

    describe('delete', () => {
        it('handles deletion errors', deleteErrorTest);
        it('works', deleteTest);
    });

    describe('create', () => {
        it('handles file write errors', createFileWriteErrorTest);
        it('works', createTest);
    });

    describe('get handler', () => {
        it('handles exceptions', getHandlerExceptionTest);
        it('works', getHandlerTest);
    });

    describe('set handler', () => {
        it('handles exceptions', setHandlerExceptionTest);
        it('works', setHandlerTest);
    });
});