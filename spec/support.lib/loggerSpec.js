const
    sinon       = require('sinon'),
    logger      = require('../../src/support.lib/logger');

const log4js = {
    getLogger : () => {},
    configure : () => {}
};

const loggingInstance = () => {
    return {
        warn : () => {},
        info : () => {},
        error : () => {},
        debug : () => {}
    };
};

const loggingTest = (done) => {
    const logMock = sinon.mock(log4js);
    logMock.expects('getLogger').once().withArgs('admin').returns(loggingInstance());
    logMock.expects('getLogger').once().withArgs('api').returns(loggingInstance());
    logMock.expects('getLogger').once().withArgs('integration').returns(loggingInstance());
    logMock.expects('getLogger').once().withArgs('interface').returns(loggingInstance());
    logMock.expects('getLogger').once().withArgs('storage').returns(loggingInstance());
    logMock.expects('getLogger').once().withArgs('rules').returns(loggingInstance());
    logMock.expects('getLogger').once().withArgs('identity').returns(loggingInstance());
    logMock.expects('getLogger').once().withArgs('messaging').returns(loggingInstance());
    logMock.expects('getLogger').once().withArgs('blob').returns(loggingInstance());
    logMock.expects('getLogger').once().withArgs('default').returns(loggingInstance());

    const instance = logger(log4js);

    expect(instance.loggers.admin.level).toEqual('debug');
    expect(instance.loggers.api.level).toEqual('debug');
    expect(instance.loggers.integration.level).toEqual('debug');
    expect(instance.loggers.interface.level).toEqual('debug');
    expect(instance.loggers.storage.level).toEqual('debug');
    expect(instance.loggers.rules.level).toEqual('debug');
    expect(instance.loggers.identity.level).toEqual('debug');
    expect(instance.loggers.messaging.level).toEqual('debug');
    expect(instance.loggers.blob.level).toEqual('debug');
    expect(instance.loggers.default.level).toEqual('debug');

    instance.logStartup('admin');

    //log
    instance.log('admin', 'warning: something bad');
    instance.log('unknown', 'warning: something bad');

    //error
    instance.error('admin', 'admin logs');
    instance.error('unknown', 'unknown logs');

    //info
    instance.info('admin', 'admin logs');
    instance.info('unknown', 'unknown logs');

    //debug
    instance.debug('admin', 'admin logs');
    instance.debug('unknown', 'unknown logs');

    //warning
    instance.warn('admin', 'admin logs');
    instance.warn('unknown', 'unknown logs');

    logMock.verify();
    done();
};

describe('Logging service', () => {
    it('works', loggingTest);
});