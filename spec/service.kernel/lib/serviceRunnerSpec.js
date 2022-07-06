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
};

const pidusage = {
    main : () => {}
};

const constructorTest = (done) => {
    const instance = serviceRunner();
    expect(instance.childProcess).not.toBe(null);
    expect(instance.nodeProcess).not.toBe(null);
    done();
};

const killTest = (done) => {
    const instance = serviceRunner();
    instance._insertProcess('test', {
        kill : () => {
            done();
        }
    });
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
    instance._resetProcesses();

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
    instance._resetProcesses();
    instance._insertProcess('doot', {
        kill : () => {
            called = true;
        }
    });
    instance.runService('doot', 'this-script', '9090', 'my-dir');

    pathMock.verify();
    processMock.verify();
    stdoutMock.verify();
    stderrMock.verify();
    expect(called).toBe(true);

    done();
};

const listServicesTest = (done) => {
    const pidMock = sinon.mock(pidusage);
    pidMock.expects('main').once().withArgs(1234).returns(Promise.resolve({
        one : {
            cpu : 10,
            memory : 20,
            elapsed : 30000
        },
        two : {
            cpu : 40,
            memory : 50,
            elapsed : 60000
        }
    }));

    const instance = serviceRunner(childProcess, logger, path, pidusage.main);
    instance._resetProcesses();
    instance._insertProcess('hello', {
        pid : 1234
    });

    instance.listServices().then((result) => {
        expect(result).toEqual([
            {
                name : 'hello',
                pids : ['one', 'two'],
                memory : 70,
                cpu : 50,
                uptime : 30
            }
        ]);

        pidMock.verify();

        done();
    });
};

describe('A service runner', () => {
    it('defaults its constructor arguments', constructorTest);
    it('can kill a service', killTest);

    describe('run service', () => {
        it('can start a service', startServiceTest);
        it('can kill an existing service', startServiceKillTest);
    });

    describe('listServices', () => {
        it('works', listServicesTest);
    });
});