const
    sinon       = require('sinon'),
    blobService = require('../../../src/service.blob/lib/blobService');

const app = {
    use : () => {}
};

const configProvider = {
    getBlobStores : () => {},
    loadStore : () => {}
};

const blobInstance = {
    init : () => {},
    handleRequest : () => {}
};

const blobInstanceProvider = function() {
    return blobInstance;
};

const constructorTest = () => {
    const instance = blobService();

    expect(instance.configProvider).not.toBe(undefined);
    expect(instance.configProvider).not.toBe(null);
    expect(instance.blobInstance).not.toBe(undefined);
    expect(instance.blobInstance).not.toBe(null);
};

const initTest = (done) => {
    const configMock = sinon.mock(configProvider);
    configMock.expects('getBlobStores').once().withArgs('my-dir').returns(Promise.resolve(['store-name']));
    configMock.expects('loadStore').once().withArgs('store-name').returns(Promise.resolve({
        name : 'my-store'
    }));

    const blobInstanceMock = sinon.mock(blobInstance);
    blobInstanceMock.expects('init').once().returns(Promise.resolve());
    blobInstanceMock.expects('handleRequest').twice();

    const appMock = sinon.mock(app);
    appMock.expects('use').once().withArgs('/my-store').callsArg(1);
    appMock.expects('use').once().withArgs('/my-store/*').callsArg(1);

    const instance = blobService(app, configProvider, blobInstanceProvider);

    instance.init('my-dir');

    setTimeout(() => {
        configMock.verify();
        appMock.verify();
        blobInstanceMock.verify();

        done();
    });
};

describe('A blob service', () => {
    it('handles constructor defaulting', constructorTest);
    it('initialises the stores', initTest);
});