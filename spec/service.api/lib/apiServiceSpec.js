const
    jasmine 		= require('jasmine'),
    sinon 			= require('sinon'),
    apiService		= require('../../../src/service.api/lib/apiService');

const definitionProvider = {
    fetchDefinition : () => {}
};

const apiInstance = {
    main : () => {},
    init : () => {}
};

const glob = {
    main : () => {}
};

const path = {
    join : () => {}
};

const constructorTest = (done) => {
    const instance = apiService();
    expect(instance.definitionProvider).not.toBe(null);
    expect(instance.apiInstance).not.toBe(null);
    expect(instance.glob).not.toBe(null);
    expect(instance.path).not.toBe(null);
    done();
};

const initTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), 'doot', '**/*.api.json').returns('doot/**/*.api.json');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('doot/**/*.api.json').callsArgWith(1, null, [
        'doot/one.api.json',
        'doot/two.api.json'
    ]);

    const definitionMock = sinon.mock(definitionProvider);
    definitionMock.expects('fetchDefinition').once('doot/one.api.json').returns(Promise.resolve('first instance'));
    definitionMock.expects('fetchDefinition').once('doot/two.api.json').returns(Promise.resolve('second instance'));

    const apiMock = sinon.mock(apiInstance);
    apiMock.expects('main').once().withArgs('app', 'first instance').returns(apiInstance);
    apiMock.expects('main').once().withArgs('app', 'second instance').returns(apiInstance);
    apiMock.expects('init').twice();

    const instance = apiService('app', definitionProvider, apiInstance.main, glob.main, path);
    instance.init('doot').then(() => {
        pathMock.verify();
        globMock.verify();
        definitionMock.verify();
        apiMock.verify();

        done();
    });
};

const globErrorTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), 'doot', '**/*.api.json').returns('doot/**/*.api.json');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('doot/**/*.api.json').callsArgWith(1, new Error('oh dear'));

    const instance = apiService('app', definitionProvider, apiInstance.main, glob.main, path);
    instance.init('doot').catch((err) => {
        expect(err).toEqual(new Error('oh dear'));

        pathMock.verify();
        globMock.verify();

        done();
    });
};

describe('An API service', () => {
    it('defaults its constructor arguments', constructorTest);
    it('initialises itself correctly', initTest);
    it('handles glob errors', globErrorTest);
});