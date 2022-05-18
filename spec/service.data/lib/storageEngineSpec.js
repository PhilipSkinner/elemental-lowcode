const
    jasmine 		= require('jasmine'),
    sinon 			= require('sinon'),
    storageEngine	= require('../../../src/service.data/lib/storageEngine');

const typesReader = {
    readTypes : () => {}
};

const typeInstance = {
    main : () => {},
    init : () => {}
};

const dataResolver = {
    detectValues : () => {}
};

const environmentService = {
    listSecrets : () => {}
};

const sqlStore = () => {
    return 'sql-store';
};

const constructorTest = (done) => {
    const instance = storageEngine();
    expect(instance.typesReader).not.toBe(null);
    expect(instance.typeInstance).not.toBe(null);
    done();
};

const sqlStoreTest = (done) => {
    const readerMock = sinon.mock(typesReader);
    readerMock.expects('readTypes').once().withArgs('my-dir').returns(Promise.resolve([{
        storageEngine       : 'sql',
        connectionString    : 'unmodified'
    }]));

    const typeMock = sinon.mock(typeInstance);
    typeMock.expects('main').once().withArgs('sql-store', 'app', sinon.match.any).returns(typeInstance);
    typeMock.expects('init').once().returns(Promise.resolve());

    const environmentMock = sinon.mock(environmentService);
    environmentMock.expects('listSecrets').once().returns('some secrets');

    const resolverMock = sinon.mock(dataResolver);
    resolverMock.expects('detectValues').once().withArgs('unmodified', {
        secrets : 'some secrets'
    }, {}, true).returns('modified');

    const instance = storageEngine('app', typesReader, typeInstance.main, sqlStore, dataResolver, environmentService);

    instance.init('my-dir').then(() => {
        readerMock.verify();
        typeMock.verify();

        done();
    });
};

describe('A storage engine', () => {
    it('defaults its constructor arguments', constructorTest);

    it('can initialise sql stores', sqlStoreTest);
});