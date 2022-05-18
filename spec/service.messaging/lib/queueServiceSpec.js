const
    sinon = require('sinon'),
    queueService = require('../../../src/service.messaging/lib/queueService');

const app = {

};

const path = {
    join : () => {}
};

const glob = {
    main : () => {}
};

const definitionProvider = {
    fetchDefinition : () => {}
};

const queueInstance = {
    main : () => {}
};

const constructorTest = (done) => {
    const instance = queueService();

    expect(instance.path).not.toBe(null);
    expect(instance.glob).not.toBe(null);
    expect(instance.definitionProvider).not.toBe(null);
    expect(instance.queueInstance).not.toBe(null);

    done();
};

const findDefinitionsErrorTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, 'dir', '**/*.queue.json').returns('an-path');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('an-path').callsArgWith(1, new Error('oops'));

    const instance = queueService(app, path, glob.main, definitionProvider, queueInstance);

    instance.findQueueDefinitions('dir').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        pathMock.verify();
        globMock.verify();

        done();
    });
};

const findDefinitionsTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, 'dir', '**/*.queue.json').returns('an-path');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('an-path').callsArgWith(1, null, 'some-definitions');

    const instance = queueService(app, path, glob.main, definitionProvider, queueInstance);

    instance.findQueueDefinitions('dir').then((definitions) => {
        expect(definitions).toEqual('some-definitions');

        pathMock.verify();
        globMock.verify();

        done();
    });
};

const terminateTest = (done) => {
    const instance = queueService(app, path, glob.main, definitionProvider, queueInstance);

    instance.instances.push({
        terminate : () => {
            done();
        }
    });

    instance.terminateInstances();
};

const compileTest = (done) => {
    const providerMock = sinon.mock(definitionProvider);
    providerMock.expects('fetchDefinition').once().withArgs('my-definition').returns(Promise.resolve('an-definition'));

    let called = false;
    const queueMock = sinon.mock(queueInstance);
    queueMock.expects('main').once().withArgs('my-app', 'an-definition').returns({
        init : () => {
            called = true;
        }
    });

    const instance = queueService('my-app', path, glob.main, definitionProvider, queueInstance.main);

    instance.compileDefinition('my-definition').then(() => {
        providerMock.verify();
        queueMock.verify();

        expect(called).toEqual(true);

        done();
    });
};

const initTest = (done) => {
    const providerMock = sinon.mock(definitionProvider);
    providerMock.expects('fetchDefinition').once().withArgs('my-definition').returns(Promise.resolve('an-definition'));

    let called = false;
    const queueMock = sinon.mock(queueInstance);
    queueMock.expects('main').once().withArgs('my-app', 'an-definition').returns({
        init : () => {
            called = true;
        }
    });

    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, 'dir', '**/*.queue.json').returns('an-path');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('an-path').callsArgWith(1, null, ['my-definition']);

    const instance = queueService('my-app', path, glob.main, definitionProvider, queueInstance.main);

    instance.init('dir').then(() => {
        providerMock.verify();
        queueMock.verify();
        pathMock.verify();
        globMock.verify();

        expect(called).toEqual(true);

        done();
    });
};

describe('A messaging queue service', () => {
    it('handles constructor defaulting', constructorTest);

    describe('can find queue definitions', () => {
        it('handling errors', findDefinitionsErrorTest);
        it('correctly', findDefinitionsTest);
    });

    it('can terminate instances', terminateTest);
    it('can compile definitions', compileTest);
    it('can init itself', initTest);
});