const
    sinon 			= require('sinon'),
    controller 		= require('../../../src/service.kernel/controllers/indexController');

const app = {
    get : () => {},
    post : () => {},
};

const fileLister = {
    tarDir : () => {},
    extractTar : () => {}
};

const roleCheckHandler = {
    enforceRoles : () => {}
};

const constructorTest = (done) => {
    const instance = controller();
    expect(instance.fileLister).not.toBe(null);
    expect(instance.roleCheckHandler).not.toBe(null);
    done();
};

const getExceptionTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('tarDir').once().withArgs('my-dir').returns(Promise.reject(new Error('not good')));

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler);

    instance.get({}, {
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

const getTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('tarDir').once().withArgs('my-dir').returns(Promise.resolve('some-data'));

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler);

    instance.get({}, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        send : (data) => {
            expect(data).toEqual('some-data');
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const postExceptionTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('extractTar').once().withArgs('my-dir', Buffer.from('my-tar', 'base64')).returns(Promise.reject(new Error('not good')));

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler);

    instance.post({
        body : {
            file : 'my-tar'
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

const postTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('extractTar').once().withArgs('my-dir', Buffer.from('my-tar', 'base64')).returns(Promise.resolve());

    const instance = controller(app, 'my-dir', fileLister, roleCheckHandler);

    instance.post({
        body : {
            file : 'my-tar'
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

describe('An index controller', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('get', () => {
        it('handles exceptions', getExceptionTest);
        it('works', getTest);
    });

    describe('post', () => {
        it('handles exceptions', postExceptionTest);
        it('works', postTest);
    });
});