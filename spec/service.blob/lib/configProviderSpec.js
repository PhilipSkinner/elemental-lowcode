const
    sinon           = require('sinon'),
    configProvider  = require('../../../src/service.blob/lib/configProvider');

const path = {
    join : () => {}
};

const glob = {
    main : () => {}
};

const fs = {
    readFile : () => {}
};

const constructorTest = () => {
    const instance = configProvider();

    expect(instance.path).not.toBe(undefined);
    expect(instance.path).not.toBe(null);
    expect(instance.glob).not.toBe(undefined);
    expect(instance.glob).not.toBe(null);
    expect(instance.fs).not.toBe(undefined);
    expect(instance.fs).not.toBe(null);
};

const getBlobStoresException = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), 'my-dir', '**/*.store.json').returns('store-search-path');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('store-search-path').callsArgWith(1, new Error('not good'));

    const instance = configProvider(path, glob.main, fs);

    instance.getBlobStores('my-dir').catch((err) => {
        expect(err).toEqual(new Error('not good'));

        pathMock.verify();
        globMock.verify();

        done();
    });
};

const getBlobStores = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), 'my-dir', '**/*.store.json').returns('store-search-path');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('store-search-path').callsArgWith(1, null, 'some-definitions');

    const instance = configProvider(path, glob.main, fs);

    instance.getBlobStores('my-dir').then((res) => {
        expect(res).toEqual('some-definitions');

        pathMock.verify();
        globMock.verify();

        done();
    });
};

const loadStoreException = (done) => {
    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my-file').callsArgWith(1, new Error('bad times'));

    const instance = configProvider(path, glob.main, fs);

    instance.loadStore('my-file').catch((err) => {
        expect(err).toEqual(new Error('bad times'));

        fsMock.verify();

        done();
    });
};

const loadStoreInvalidJSON = (done) => {
    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my-file').callsArgWith(1, null, '{}{}{}{}{}{SD}{SD}{DF}{DF}{DSF');

    const instance = configProvider(path, glob.main, fs);

    instance.loadStore('my-file').catch((err) => {
        expect(err).toEqual(new Error('Could not load store, invalid JSON detected'));

        fsMock.verify();

        done();
    });
};

const loadStore = (done) => {
    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my-file').callsArgWith(1, null, '{"hello":"world"}');

    const instance = configProvider(path, glob.main, fs);

    instance.loadStore('my-file').then((res) => {
        expect(res).toEqual({
            hello : 'world'
        });

        fsMock.verify();

        done();
    });
};

describe('A config provider', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('getBlobStores', () => {
        it('handles exceptions', getBlobStoresException);
        it('works', getBlobStores);
    });

    describe('loadStore', () => {
        it('handles file read exceptions', loadStoreException);
        it('handles invalid JSON', loadStoreInvalidJSON);
        it('works', loadStore);
    });
});