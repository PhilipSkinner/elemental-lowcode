const
    sinon 			= require('sinon'),
    controller 		= require('../../../src/service.kernel/controllers/serviceController');

const app = {
    get : () => {},
    post : () => {},
    put : () => {},
    delete : () => {},
    patch : () => {}
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

const childProcess = {
    spawn : () => {},
    on : () => {},
    stdout : {
        on : () => {}
    },
    stderr : {
        on : () => {}
    }
};

const constructorTest = (done) => {
    const instance = controller();
    expect(instance.fileLister).not.toBe(null);
    expect(instance.path).not.toBe(null);
    expect(instance.roleCheckHandler).not.toBe(null);
    expect(instance.childProcess).not.toBe(null);
    done();
};

/* SERVICES */

const getServicesGlobExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', '*.js').returns('search-path');

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

const getServicesTest = (done) => {
        const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', '*.js').returns('search-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('search-path').returns(Promise.resolve([{
        name : 'this is my name'
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

const getServiceSingularReadErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readFile').once().withArgs('my-dir', 'my-name.js').returns(Promise.reject(new Error('oops')));

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

const getServiceSingularTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readFile').once().withArgs('my-dir', 'my-name.js').returns(Promise.resolve('some-content'));

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

const updateServiceFileWriteErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-name.js').returns(Promise.reject(new Error('really not good')));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler);

    instance.update({
        body : {
            payload : 'the-body'
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
            fileMock.verify();

            done();
        }
    });
};

const updateServiceTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-name.js').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler);

    instance.update({
        body : {
            payload : 'the-body'
        },
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

const deleteServiceErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('my-dir', 'my-name.js').returns(Promise.reject(new Error('oops')));

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

const deleteServiceTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('my-dir', 'my-name.js').returns(Promise.resolve());

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

const createServiceFileWriteErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-name.js').returns(Promise.reject(new Error('really not good')));

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

const createServiceTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-name.js').returns(Promise.resolve());

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
            expect(value).toEqual('/services/my-name');
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

/* DEPENDENCIES */

const getDependenciesReadErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('my-dir', 'package.json').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler);

    instance.getDependencies({}, {
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

const getDependendiesTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('my-dir', 'package.json').returns(Promise.resolve({
        dependencies : {
            something : '1.2.3'
        }
    }));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler);

    instance.getDependencies({
        params : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual([
                {
                    name : 'something',
                    version : '1.2.3'
                }
            ]);
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const deleteDependencyExceptionTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('my-dir', 'package.json').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler);

    instance.deleteDependency({}, {
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

const deleteDependencyTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('my-dir', 'package.json').returns(Promise.resolve({
        dependencies : {
            something : '1.2.3'
        }
    }));
    fileMock.expects('writeFile').once().withArgs('my-dir', 'package.json').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler);

    instance.deleteDependency({
        params : {
            name : 'something'
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

const updateDependencyExceptionTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('my-dir', 'package.json').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler);

    instance.updateDependency({}, {
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

const updateDependencyTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('my-dir', 'package.json').returns(Promise.resolve({
        dependencies : {
            something : '1.2.3'
        }
    }));
    fileMock.expects('writeFile').once().withArgs('my-dir', 'package.json').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler);

    instance.updateDependency({
        params : {
            name : 'something'
        },
        body : {
            version : '2.3.4'
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

const createDependencyExceptionTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('my-dir', 'package.json').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler);

    instance.createDependency({}, {
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

const createDependencyTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('my-dir', 'package.json').returns(Promise.resolve({
        dependencies : {
            something : '1.2.3'
        }
    }));
    fileMock.expects('writeFile').once().withArgs('my-dir', 'package.json').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler);

    instance.createDependency({
        params : {
            name : 'something'
        },
        body : {
            version : '2.3.4'
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

const installTest = (done) => {
    const processMock = sinon.mock(childProcess);
    processMock.expects('spawn').once().withArgs('npm', [
        'i'
    ], {
        cwd : 'my-dir'
    }).returns(childProcess);
    processMock.expects('on').once().withArgs('close').callsArgWith(1, 0);

    const stdoutMock = sinon.mock(childProcess.stdout);
    stdoutMock.expects('on').once().withArgs('data').callsArgWith(1, 'stdout-data');

    const stderrMock = sinon.mock(childProcess.stderr);
    stderrMock.expects('on').once().withArgs('data').callsArgWith(1, 'stderr-data');

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler, childProcess);

    instance.installDependencies({}, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual({
                stdout : 'stdout-data',
                stderr : 'stderr-data',
                success : true
            });
        },
        end : () => {
            processMock.verify();
            stdoutMock.verify();
            stderrMock.verify();

            done();
        }
    });
};

const installFailureTest = (done) => {
    const processMock = sinon.mock(childProcess);
    processMock.expects('spawn').once().withArgs('npm', [
        'i'
    ], {
        cwd : 'my-dir'
    }).returns(childProcess);
    processMock.expects('on').once().withArgs('close').callsArgWith(1, 1234);

    const stdoutMock = sinon.mock(childProcess.stdout);
    stdoutMock.expects('on').once().withArgs('data').callsArgWith(1, 'stdout-data');

    const stderrMock = sinon.mock(childProcess.stderr);
    stderrMock.expects('on').once().withArgs('data').callsArgWith(1, 'stderr-data');

    const instance = controller(app, 'my-dir', fileLister, path, roleCheckHandler, childProcess);

    instance.installDependencies({}, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual({
                stdout : 'stdout-data',
                stderr : 'stderr-data',
                success : false
            });
        },
        end : () => {
            processMock.verify();
            stdoutMock.verify();
            stderrMock.verify();

            done();
        }
    });
};

describe('A service controller', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('services', () => {
        describe('get', () => {
            it('handles glob exceptions', getServicesGlobExceptionTest);
            it('works', getServicesTest);
        });

        describe('get singular', () => {
            it('handles read errors', getServiceSingularReadErrorTest);
            it('works', getServiceSingularTest);
        });

        describe('update', () => {
            it('handles file write errors', updateServiceFileWriteErrorTest);
            it('works', updateServiceTest);
        });

        describe('delete', () => {
            it('handles deletion errors', deleteServiceErrorTest);
            it('works', deleteServiceTest);
        });

        describe('create', () => {
            it('handles file write errors', createServiceFileWriteErrorTest);
            it('works', createServiceTest);
        });
    });

    describe('dependencies', () => {
        describe('get', () => {
            it('handles file read errors', getDependenciesReadErrorTest);
            it('works', getDependendiesTest);
        });

        describe('delete', () => {
            it('handles exceptions', deleteDependencyExceptionTest);
            it('works', deleteDependencyTest);
        });

        describe('update', () => {
            it('handles exceptions', updateDependencyExceptionTest);
            it('works', updateDependencyTest);
        });

        describe('create', () => {
            it('handles exceptions', createDependencyExceptionTest);
            it('works', createDependencyTest);
        });

        describe('install', () => {
            it('works', installTest);
            it('handles failures', installFailureTest);
        });
    });
});