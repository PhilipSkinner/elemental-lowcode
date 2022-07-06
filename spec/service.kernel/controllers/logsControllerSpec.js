const
    sinon           = require('sinon'),
    controller      = require('../../../src/service.kernel/controllers/logsController');

const app = {
    get : () => {},
};

const roleCheckHandler = {
    enforceRoles : () => {}
};

const path = {
    join : () => {}
};

const readLastLines = {
    read : () => {}
};

const serviceRunner = {
    listServices : () => {}
};

const constructorTest = (done) => {
    const instance = controller();
    expect(instance.readLastLines).not.toBe(null);
    expect(instance.path).not.toBe(null);
    expect(instance.roleCheckHandler).not.toBe(null);
    done();
};

const getExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, '../logs/service-name.log').returns('my-log');

    const readMock = sinon.mock(readLastLines);
    readMock.expects('read').once().withArgs('my-log', 0).returns(Promise.reject());

    const instance = controller(app, 'my-dir', roleCheckHandler, readLastLines, path);

    instance.get({
        params : {
            service : 'service-name'
        },
        query : {

        }
    }, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual({});
        },
        end : () => {
            pathMock.verify();
            readMock.verify();

            done();
        }
    });
};

const getTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, '../logs/service-name.log').returns('my-log');

    const readMock = sinon.mock(readLastLines);
    readMock.expects('read').once().withArgs('my-log', 0).returns(Promise.resolve('some logs'));

    const instance = controller(app, 'my-dir', roleCheckHandler, readLastLines, path);

    instance.get({
        params : {
            service : 'service-name'
        },
        query : {

        }
    }, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual({
                lines : 'some logs'
            });
        },
        end : () => {
            pathMock.verify();
            readMock.verify();

            done();
        }
    });
};

const getOffsetTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, '../logs/service-name.log').returns('my-log');

    const readMock = sinon.mock(readLastLines);
    readMock.expects('read').once().withArgs('my-log', 1234).returns(Promise.resolve('some logs'));

    const instance = controller(app, 'my-dir', roleCheckHandler, readLastLines, path);

    instance.get({
        params : {
            service : 'service-name'
        },
        query : {
            from : 1234
        }
    }, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual({
                lines : 'some logs'
            });
        },
        end : () => {
            pathMock.verify();
            readMock.verify();

            done();
        }
    });
};

const statusExceptionTest = (done) => {
    const serviceMock = sinon.mock(serviceRunner);
    serviceMock.expects('listServices').once().returns(Promise.reject(new Error('bad times')));

    const instance = controller(app, 'my-dir', roleCheckHandler, readLastLines, path, serviceRunner);

    instance.status('req', {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: bad times'
                ]
            });
        },
        end : () => {
            serviceMock.verify();

            done();
        }
    });
};

const statusTest = (done) => {
    const serviceMock = sinon.mock(serviceRunner);
    serviceMock.expects('listServices').once().returns(Promise.resolve('some data'));

    const instance = controller(app, 'my-dir', roleCheckHandler, readLastLines, path, serviceRunner);

    instance.status('req', {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual({
                services : 'some data'
            });
        },
        end : () => {
            serviceMock.verify();

            done();
        }
    });
};

describe('A log controller', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('get', () => {
        it('handles exceptions', getExceptionTest);
        it('works', getTest);
        it('works with offsets', getOffsetTest);
    });

    describe('status', () => {
        it('handles exceptions', statusExceptionTest);
        it('works', statusTest);
    });
});