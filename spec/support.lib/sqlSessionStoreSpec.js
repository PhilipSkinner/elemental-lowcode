const
    sinon               = require('sinon'),
    sqlSessionStore     = require('../../src/support.lib/sqlSessionStore');

const sqlStore = {
    main : () => {},
    getResources : () => {},
    deleteResource : () => {},
    getResource : () => {},
    createResource : () => {},
    updateResource : () => {}
};

const constructorTest = (done) => {
    const store = function() {}
    store.prototype.doot = () => {}

    const instance = sqlSessionStore({
        Store : store
    }, 'sqlite:world.sqlite');
    expect(instance.sqlStore).not.toBe(null);
    done();
};

const allExceptionTest = (done) => {
    const storeMock = sinon.mock(sqlStore);
    storeMock.expects('main').once().returns(sqlStore);
    storeMock.expects('getResources').once().withArgs('site__sessions', 1, 500, []).returns(Promise.reject(new Error('oh noes')));

    const instance = sqlSessionStore(null, null, 'site', sqlStore.main);

    instance.all((err) => {
        expect(err).toEqual(new Error('oh noes'));

        storeMock.verify();

        done();
    });
};

const allTest = (done) => {
    const storeMock = sinon.mock(sqlStore);
    storeMock.expects('main').once().returns(sqlStore);
    storeMock.expects('getResources').once().withArgs('site__sessions', 1, 500, []).returns(Promise.resolve([
        {
            session : JSON.stringify({ hello : 'world' })
        }
    ]));

    const instance = sqlSessionStore(null, null, 'site', sqlStore.main);

    instance.all((err, results) => {
        expect(err).toBe(null);
        expect(results).toEqual([
            {
                hello : 'world'
            }
        ]);

        storeMock.verify();

        done();
    });
};

const destroyExceptionTest = (done) => {
    const storeMock = sinon.mock(sqlStore);
    storeMock.expects('main').once().returns(sqlStore);
    storeMock.expects('deleteResource').once().withArgs('site__sessions', '1234').returns(Promise.reject(new Error('oh noes')));

    const instance = sqlSessionStore(null, null, 'site', sqlStore.main);

    instance.destroy('1234', (err) => {
        expect(err).toEqual(new Error('oh noes'));

        storeMock.verify();

        done();
    });
};

const destroyExceptionTestNoCallback = (done) => {
    const storeMock = sinon.mock(sqlStore);
    storeMock.expects('main').once().returns(sqlStore);
    storeMock.expects('deleteResource').once().withArgs('site__sessions', '1234').returns(Promise.reject(new Error('oh noes')));

    const instance = sqlSessionStore(null, null, 'site', sqlStore.main);

    instance.destroy('1234');

    setTimeout(() => {
        storeMock.verify();
        done();
    }, 1);
};

const destroyTest = (done) => {
    const storeMock = sinon.mock(sqlStore);
    storeMock.expects('main').once().returns(sqlStore);
    storeMock.expects('deleteResource').once().withArgs('site__sessions', '1234').returns(Promise.resolve());

    const instance = sqlSessionStore(null, null, 'site', sqlStore.main);

    instance.destroy('1234', (err) => {
        expect(err).toBe(undefined);

        storeMock.verify();

        done();
    });
};

const destroyTestNoCallback = (done) => {
    const storeMock = sinon.mock(sqlStore);
    storeMock.expects('main').once().returns(sqlStore);
    storeMock.expects('deleteResource').once().withArgs('site__sessions', '1234').returns(Promise.resolve());

    const instance = sqlSessionStore(null, null, 'site', sqlStore.main);

    instance.destroy('1234');

    setTimeout(() => {
        storeMock.verify();

        done();
    }, 1);
};

const clearNotImplemented = (done) => {
    const instance = sqlSessionStore(null, null, 'site', sqlStore.main);

    instance.clear((err) => {
        expect(err).toEqual(new Error('Not implemented'));

        done();
    });
};

const lengthNotImplemented = (done) => {
    const instance = sqlSessionStore(null, null, 'site', sqlStore.main);

    instance.length((err) => {
        expect(err).toEqual(new Error('Not implemented'));

        done();
    });
};

const getExceptionTest = (done) => {
    const storeMock = sinon.mock(sqlStore);
    storeMock.expects('main').once().returns(sqlStore);
    storeMock.expects('getResource').once().withArgs('site__sessions', '1234').returns(Promise.reject(new Error('oh noes')));

    const instance = sqlSessionStore(null, null, 'site', sqlStore.main);

    instance.get('1234', (err) => {
        expect(err).toEqual(new Error('oh noes'));

        storeMock.verify();

        done();
    });
};

const getNullSession = (done) => {
    const storeMock = sinon.mock(sqlStore);
    storeMock.expects('main').once().returns(sqlStore);
    storeMock.expects('getResource').once().withArgs('site__sessions', '1234').returns(Promise.resolve(null));

    const instance = sqlSessionStore(null, null, 'site', sqlStore.main);

    instance.get('1234', (err, session) => {
        expect(err).toBe(null);
        expect(session).toBe(null);

        storeMock.verify();

        done();
    });
};

const getSessionTest = (done) => {
    const storeMock = sinon.mock(sqlStore);
    storeMock.expects('main').once().returns(sqlStore);
    storeMock.expects('getResource').once().withArgs('site__sessions', '1234').returns(Promise.resolve({
        session : JSON.stringify({ hello : 'world' })
    }));

    const instance = sqlSessionStore(null, null, 'site', sqlStore.main);

    instance.get('1234', (err, session) => {
        expect(err).toBe(null);
        expect(session).toEqual({
            hello : 'world'
        });

        storeMock.verify();

        done();
    });
};

const setExceptionTest = (done) => {
    const storeMock = sinon.mock(sqlStore);
    storeMock.expects('main').once().returns(sqlStore);
    storeMock.expects('createResource').once().withArgs('site__sessions', '1234', {
        session : JSON.stringify({ hello : 'world' })
    }).returns(Promise.reject(new Error('oh noes')));

    const instance = sqlSessionStore(null, null, 'site', sqlStore.main);

    instance.set('1234', { hello : 'world' }, (err) => {
        expect(err).toEqual(new Error('oh noes'));

        storeMock.verify();

        done();
    });
};

const setDuplicateTest = (done) => {
    const storeMock = sinon.mock(sqlStore);
    storeMock.expects('main').once().returns(sqlStore);
    storeMock.expects('createResource').once().withArgs('site__sessions', '1234', {
        session : JSON.stringify({ hello : 'world' })
    }).returns(Promise.reject(new Error('Resource already exists')));
    storeMock.expects('updateResource').once().withArgs('site__sessions', '1234', {
        session : JSON.stringify({ hello : 'world' })
    }).returns(Promise.resolve());

    const instance = sqlSessionStore(null, null, 'site', sqlStore.main);

    instance.set('1234', { hello : 'world' }, (err) => {
        expect(err).toEqual(undefined);

        storeMock.verify();

        done();
    });
};

const setDuplicateExceptionTest = (done) => {
    const storeMock = sinon.mock(sqlStore);
    storeMock.expects('main').once().returns(sqlStore);
    storeMock.expects('createResource').once().withArgs('site__sessions', '1234', {
        session : JSON.stringify({ hello : 'world' })
    }).returns(Promise.reject(new Error('Resource already exists')));
    storeMock.expects('updateResource').once().withArgs('site__sessions', '1234', {
        session : JSON.stringify({ hello : 'world' })
    }).returns(Promise.reject(new Error('oops')));

    const instance = sqlSessionStore(null, null, 'site', sqlStore.main);

    instance.set('1234', { hello : 'world' }, (err) => {
        expect(err).toEqual(new Error('oops'));

        storeMock.verify();

        done();
    });
};

const setTest = (done) => {
    const storeMock = sinon.mock(sqlStore);
    storeMock.expects('main').once().returns(sqlStore);
    storeMock.expects('createResource').once().withArgs('site__sessions', '1234', {
        session : JSON.stringify({ hello : 'world' })
    }).returns(Promise.resolve());

    const instance = sqlSessionStore(null, null, 'site', sqlStore.main);

    instance.set('1234', { hello : 'world' }, (err) => {
        expect(err).toEqual(undefined);

        storeMock.verify();

        done();
    });
};

const touchExceptionTest = (done) => {
    const storeMock = sinon.mock(sqlStore);
    storeMock.expects('main').once().returns(sqlStore);
    storeMock.expects('createResource').once().withArgs('site__sessions', '1234', {
        session : JSON.stringify({ hello : 'world' })
    }).returns(Promise.reject(new Error('oh noes')));

    const instance = sqlSessionStore(null, null, 'site', sqlStore.main);

    instance.touch('1234', { hello : 'world' }, (err) => {
        expect(err).toEqual(new Error('oh noes'));

        storeMock.verify();

        done();
    });
};

const touchDuplicateTest = (done) => {
    const storeMock = sinon.mock(sqlStore);
    storeMock.expects('main').once().returns(sqlStore);
    storeMock.expects('createResource').once().withArgs('site__sessions', '1234', {
        session : JSON.stringify({ hello : 'world' })
    }).returns(Promise.reject(new Error('Resource already exists')));
    storeMock.expects('updateResource').once().withArgs('site__sessions', '1234', {
        session : JSON.stringify({ hello : 'world' })
    }).returns(Promise.resolve());

    const instance = sqlSessionStore(null, null, 'site', sqlStore.main);

    instance.touch('1234', { hello : 'world' }, (err) => {
        expect(err).toEqual(undefined);

        storeMock.verify();

        done();
    });
};

const touchDuplicateExceptionTest = (done) => {
    const storeMock = sinon.mock(sqlStore);
    storeMock.expects('main').once().returns(sqlStore);
    storeMock.expects('createResource').once().withArgs('site__sessions', '1234', {
        session : JSON.stringify({ hello : 'world' })
    }).returns(Promise.reject(new Error('Resource already exists')));
    storeMock.expects('updateResource').once().withArgs('site__sessions', '1234', {
        session : JSON.stringify({ hello : 'world' })
    }).returns(Promise.reject(new Error('oops')));

    const instance = sqlSessionStore(null, null, 'site', sqlStore.main);

    instance.touch('1234', { hello : 'world' }, (err) => {
        expect(err).toEqual(new Error('oops'));

        storeMock.verify();

        done();
    });
};

const touchTest = (done) => {
    const storeMock = sinon.mock(sqlStore);
    storeMock.expects('main').once().returns(sqlStore);
    storeMock.expects('createResource').once().withArgs('site__sessions', '1234', {
        session : JSON.stringify({ hello : 'world' })
    }).returns(Promise.resolve());

    const instance = sqlSessionStore(null, null, 'site', sqlStore.main);

    instance.touch('1234', { hello : 'world' }, (err) => {
        expect(err).toEqual(undefined);

        storeMock.verify();

        done();
    });
};

describe('A sql session store', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('all', () => {
        it('handles exceptions', allExceptionTest);
        it('returns all sessions', allTest);
    });

    describe('destroy', () => {
        it('handles exceptions', destroyExceptionTest);
        it('handles exceptions, no callback', destroyExceptionTestNoCallback);
        it('deletes the session', destroyTest);
        it('deletes the session, no callback', destroyTestNoCallback);
    });

    describe('clear', () => {
        it('is not implemented', clearNotImplemented);
    });

    describe('length', () => {
        it('is not implemented', lengthNotImplemented);
    });

    describe('get', () => {
        it('handles exceptions', getExceptionTest);
        it('handles null sessions', getNullSession);
        it('gets the session', getSessionTest);
    });

    describe('set', () => {
        it('handles exceptions', setExceptionTest);
        it('handles duplicates', setDuplicateTest);
        it('handles duplicate exceptions', setDuplicateExceptionTest);
        it('creates the session', setTest);
    });

    describe('touch', () => {
        it('handles exceptions', touchExceptionTest);
        it('handles duplicates', touchDuplicateTest);
        it('handles duplicate exceptions', touchDuplicateExceptionTest);
        it('creates the session', touchTest);
    });
});