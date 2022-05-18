const
    sinon = require('sinon'),
    sqlQueue = require('../../../../src/service.messaging/lib/queues/sqlQueue');

const sqlStore = {
    main : () => {},
    createResource : () => {},
    getResource : () => {},
    updateResource : () => {},
    deleteResource : () => {},
    getResources : () => {}
};

const constructorTest = (done) => {
    const instance = sqlQueue('', sqlStore.main);

    expect(instance.name).not.toBe(null);
    expect(instance.messageDefinition).not.toBe(null);
    expect(instance.sqlStore).not.toBe(null);

    done();
};

const insertMessageTest = (done) => {
    const sqlMock = sinon.mock(sqlStore);
    sqlMock.expects('main').once().withArgs('connection-string').returns(sqlStore);
    sqlMock.expects('createResource').once().withArgs('queue__messages', 'id', 'the-message').returns(Promise.resolve());

    const instance = sqlQueue('connection-string', sqlStore.main);

    instance.insertMessage('queue', 'id', 'the-message').then(() => {
        sqlMock.verify();

        done();
    });
};

const inProgressTest = (done) => {
    const sqlMock = sinon.mock(sqlStore);
    sqlMock.expects('main').once().withArgs('connection-string').returns(sqlStore);
    sqlMock.expects('getResource').once().withArgs('queue__messages', 'id').returns(Promise.resolve({
        hello : 'world'
    }));
    sqlMock.expects('updateResource').once().withArgs('queue__messages', 'id', {
        hello : 'world',
        status : 'INPROGRESS'
    }).returns(Promise.resolve());

    const instance = sqlQueue('connection-string', sqlStore.main);

    instance.markAsInProgress('queue', 'id').then(() => {
        sqlMock.verify();

        done();
    });
};

const completeTest = (done) => {
    const sqlMock = sinon.mock(sqlStore);
    sqlMock.expects('main').once().withArgs('connection-string').returns(sqlStore);
    sqlMock.expects('getResource').once().withArgs('queue__messages', 'id').returns(Promise.resolve({
        hello : 'world'
    }));
    sqlMock.expects('updateResource').once().withArgs('queue__messages', 'id', {
        hello : 'world',
        status : 'COMPLETE',
        result : '"the-message"'
    }).returns(Promise.resolve());

    const instance = sqlQueue('connection-string', sqlStore.main);

    instance.markAsComplete('queue', 'id', 'the-message').then(() => {
        sqlMock.verify();

        done();
    });
};

const errorTest = (done) => {
    const sqlMock = sinon.mock(sqlStore);
    sqlMock.expects('main').once().withArgs('connection-string').returns(sqlStore);
    sqlMock.expects('getResource').once().withArgs('queue__messages', 'id').returns(Promise.resolve({
        hello : 'world'
    }));
    sqlMock.expects('updateResource').once().withArgs('queue__messages', 'id', {
        hello : 'world',
        status : 'ERROR',
        error : '"the-error"'
    }).returns(Promise.resolve());

    const instance = sqlQueue('connection-string', sqlStore.main);

    instance.markAsError('queue', 'id', 'the-error').then(() => {
        sqlMock.verify();

        done();
    });
};

const getMessageInvalidJSON = (done) => {
    const sqlMock = sinon.mock(sqlStore);
    sqlMock.expects('main').once().withArgs('connection-string').returns(sqlStore);
    sqlMock.expects('getResource').once().withArgs('queue__messages', 'id').returns(Promise.resolve({
        hello : 'world',
        request : '"}{£"}{£}"{£}£"{£',
        result : '"}{£"}{£}"{£}£"{£',
        error : '"}{£"}{£}"{£}£"{£',
    }));

    const instance = sqlQueue('connection-string', sqlStore.main);

    instance.getMessage('queue', 'id').then((message) => {
        expect(message).toEqual({
            hello : 'world',
            request : null,
            result : null,
            error : null
        });

        sqlMock.verify();

        done();
    });
};

const getMessageTest = (done) => {
    const sqlMock = sinon.mock(sqlStore);
    sqlMock.expects('main').once().withArgs('connection-string').returns(sqlStore);
    sqlMock.expects('getResource').once().withArgs('queue__messages', 'id').returns(Promise.resolve({
        hello : 'world',
        request : '{"some":"JSON"}',
        result : '{"some":"JSON"}',
        error : '{"some":"JSON"}',
    }));

    const instance = sqlQueue('connection-string', sqlStore.main);

    instance.getMessage('queue', 'id').then((message) => {
        expect(message).toEqual({
            hello : 'world',
            request : {
                some : 'JSON',
            },
            result : {
                some : 'JSON',
            },
            error : {
                some : 'JSON',
            }
        });

        sqlMock.verify();

        done();
    });
};

const deleteMessageTest = (done) => {
    const sqlMock = sinon.mock(sqlStore);
    sqlMock.expects('main').once().withArgs('connection-string').returns(sqlStore);
    sqlMock.expects('deleteResource').once().withArgs('queue__messages', 'id').returns(Promise.resolve());

    const instance = sqlQueue('connection-string', sqlStore.main);

    instance.deleteMessage('queue', 'id').then(() => {
        sqlMock.verify();

        done();
    });
};

const getNextMessageNoMessage = (done) => {
    const sqlMock = sinon.mock(sqlStore);
    sqlMock.expects('main').once().withArgs('connection-string').returns(sqlStore);
    sqlMock.expects('getResources').once().withArgs('queue__messages', 1, 1, [
        {
            path : '$.status',
            value : 'PENDING'
        },
        {
            path : '$.queue',
            value : 'queue'
        }
    ]).returns(Promise.resolve([]));

    const instance = sqlQueue('connection-string', sqlStore.main);

    instance.getNextMessage('queue').then((message) => {
        expect(message).toEqual(null);

        sqlMock.verify();

        done();
    });
};

const getNextMessageInvalidJSON = (done) => {
    const sqlMock = sinon.mock(sqlStore);
    sqlMock.expects('main').once().withArgs('connection-string').returns(sqlStore);
    sqlMock.expects('getResources').once().withArgs('queue__messages', 1, 1, [
        {
            path : '$.status',
            value : 'PENDING'
        },
        {
            path : '$.queue',
            value : 'queue'
        }
    ]).returns(Promise.resolve([{
        hello : 'world',
        request : '"}{£"}{£}"{£}£"{£',
        result : '"}{£"}{£}"{£}£"{£',
        error : '"}{£"}{£}"{£}£"{£',
    }]));

    const instance = sqlQueue('connection-string', sqlStore.main);

    instance.getNextMessage('queue').then((message) => {
        expect(message).toEqual({
            hello : 'world',
            request : null,
            result : null,
            error : null
        });

        sqlMock.verify();

        done();
    });
};

const getNextMessageTest = (done) => {
    const sqlMock = sinon.mock(sqlStore);
    sqlMock.expects('main').once().withArgs('connection-string').returns(sqlStore);
    sqlMock.expects('getResources').once().withArgs('queue__messages', 1, 1, [
        {
            path : '$.status',
            value : 'PENDING'
        },
        {
            path : '$.queue',
            value : 'queue'
        }
    ]).returns(Promise.resolve([{
        hello : 'world',
        request : '{"some":"JSON"}',
        result : '{"some":"JSON"}',
        error : '{"some":"JSON"}',
    }]));

    const instance = sqlQueue('connection-string', sqlStore.main);

    instance.getNextMessage('queue').then((message) => {
        expect(message).toEqual({
            hello : 'world',
            request : {
                some : 'JSON',
            },
            result : {
                some : 'JSON',
            },
            error : {
                some : 'JSON',
            }
        });

        sqlMock.verify();

        done();
    });
};

describe('A sql queue service', () => {
    it('handles constructor defaulting', constructorTest);

    it('can insert messages', insertMessageTest);
    it('can mark messages as in progress', inProgressTest);
    it('can mark messages as complete', completeTest);
    it('can mark messages as errored', errorTest);

    describe('get message', () => {
        it('supports invalid json', getMessageInvalidJSON);
        it('works', getMessageTest);
    });

    it('can delete a message', deleteMessageTest);


    describe('get next message', () => {
        it('no message', getNextMessageNoMessage);
        it('supports invalid json', getNextMessageInvalidJSON);
        it('works', getNextMessageTest);
    });
});