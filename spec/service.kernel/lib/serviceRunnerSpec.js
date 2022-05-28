const
    sinon 			= require('sinon'),
    serviceRunner 	= require('../../../src/service.kernel/lib/serviceRunner');

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

const path = {
    dirname : () => {},
    join : () => {}
};

const logger = {
    logStartup : () => {},
    log : () => {},
    error : () => {}
}

const constructorTest = (done) => {
    const instance = serviceRunner();
    expect(instance.childProcess).not.toBe(null);
    expect(instance.nodeProcess).not.toBe(null);
    done();
};

const killTest = (done) => {
    const instance = serviceRunner();
    instance.processes.test = {
        kill : () => {
            done();
        }
    };
    instance.stopService('test');
};

const startServiceTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('dirname').twice().withArgs('this-script').returns('the-dirname');
    pathMock.expects('join').once().withArgs('the-dirname', '../support.lib').returns('lib-path');

    const stdoutMock = sinon.mock(childProcess.stdout);
    stdoutMock.expects('on').once().withArgs('data').callsArgWith(1, 'some logs\n\n');

    const stderrMock = sinon.mock(childProcess.stderr);
    stderrMock.expects('on').once().withArgs('data').callsArgWith(1, 'some errors\n\n');

    const processMock = sinon.mock(childProcess);
    processMock.expects('spawn').once().withArgs('./node_modules/.bin/nodemon', [
        '--watch',
        'the-dirname',
        '--watch',
        'lib-path',
        'this-script'
    ]).returns(childProcess);
    processMock.expects('on').once().withArgs('error').callsArgWith(1, 'hello');
    processMock.expects('on').once().withArgs('close').callsArg(1);

    const instance = serviceRunner(childProcess, logger, path);

    instance.runService('doot', 'this-script', '9090', 'my-dir', { custom : 'env'});

    pathMock.verify();
    processMock.verify();
    stdoutMock.verify();
    stderrMock.verify();

    done();
};

const startServiceKillTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('dirname').twice().withArgs('this-script').returns('the-dirname');
    pathMock.expects('join').once().withArgs('the-dirname', '../support.lib').returns('lib-path');

    const stdoutMock = sinon.mock(childProcess.stdout);
    stdoutMock.expects('on').once().withArgs('data').callsArgWith(1, 'some logs\n\n');

    const stderrMock = sinon.mock(childProcess.stderr);
    stderrMock.expects('on').once().withArgs('data').callsArgWith(1, 'some errors\n\n');

    const processMock = sinon.mock(childProcess);
    processMock.expects('spawn').once().withArgs('./node_modules/.bin/nodemon', [
        '--watch',
        'the-dirname',
        '--watch',
        'lib-path',
        'this-script'
    ]).returns(childProcess);
    processMock.expects('on').once().withArgs('error').callsArgWith(1, 'hello');
    processMock.expects('on').once().withArgs('close').callsArg(1);

    const instance = serviceRunner(childProcess, logger, path);
    let called = false;
    instance.processes.doot = {
        kill : () => {
            called = true;
        }
    };
    instance.runService('doot', 'this-script', '9090', 'my-dir');

    pathMock.verify();
    processMock.verify();
    stdoutMock.verify();
    stderrMock.verify();
    expect(called).toBe(true);

    done();
};

describe('A service runner', () => {
    it('defaults its constructor arguments', constructorTest);
    it('can kill a service', killTest);

    describe('run service', () => {
        it('can start a service', startServiceTest);
        it('can kill an existing service', startServiceKillTest);
    });
});