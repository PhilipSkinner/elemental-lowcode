const
    sinon           = require('sinon'),
    controller      = require('../../../src/service.kernel/controllers/documentationController');

const app = {
    get : () => {}
};

const find = {
    find : () => {}
};

const path = {
    join : () => {}
};

const constructorTest = (done) => {
    const instance = controller();
    expect(instance.find).not.toBe(undefined);
    expect(instance.find).not.toBe(null);
    expect(instance.path).not.toBe(undefined);
    expect(instance.path).not.toBe(null);
    done();
};

const endpointInitTest = (done) => {
    const appMock = sinon.mock(app);
    appMock.expects('get').once().withArgs("/documentation");

    const instance = controller(app, find, path);

    appMock.verify();
    done();
};

const invalidQueryTest = (done) => {
    const instance = controller(null, find, path);

    instance.get({
        query : {
            query : 'too'
        }
    }, {
        json : (data) => {
            expect(data).toBe(null);

            done();
        }
    });
};

const errorTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, '../../support.documentation/').returns('docs');

    const findMock = sinon.mock(find);
    findMock.expects('find').once().withArgs('hello', 'docs').returns(Promise.reject(new Error('oh dear')));

    const instance = controller(null, find, path);
    instance.get({
        query : {
            query : 'hello'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oh dear'
                ]
            });
        },
        end : () => {
            pathMock.verify();
            findMock.verify();

            done();
        }
    });
};

const getTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').twice().withArgs(sinon.match.any, '../../support.documentation/').returns('docs');

    const findMock = sinon.mock(find);
    findMock.expects('find').once().withArgs('hello', 'docs').returns(Promise.resolve({
        hello : {
            there : 'general kenobi'
        }
    }));

    const instance = controller(null, find, path);
    instance.get({
        query : {
            query : 'hello'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual([
                {
                    there: 'general kenobi',
                    file: 'hello'
                }
            ]);
        },
        end : () => {
            pathMock.verify();
            findMock.verify();

            done();
        }
    });
};

describe('A documentation controller', () => {
    it('handles constructor defaulting', constructorTest);
    it('adds its endpoints', endpointInitTest);

    describe('get', () => {
        it('handles invalid queries', invalidQueryTest);
        it('handles errors', errorTest);
        it('works', getTest);
    });
});
