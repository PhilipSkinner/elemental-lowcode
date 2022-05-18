const
    sinon 			= require('sinon'),
    websiteService 	= require('../../../src/service.interface/lib/websiteService');

const app = {

};

const configReader = {
    readMainConfig : () => {},
    readDefinition : () => {}
};

const _websiteInstance = {
    init : () => {}
};

const websiteInstance = function() {
    return _websiteInstance;
};

const glob = {
    main : () => {}
};

const path = {
    join : () => {}
};

const constructorTest = (done) => {
    const instance = websiteService();
    expect(instance.configReader).not.toBe(null);
    expect(instance.websiteInstance).not.toBe(null);
    expect(instance.glob).not.toBe(null);
    expect(instance.path).not.toBe(null);
    done();
};

const findDefinitionsExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('dir', '**/*.website.json').returns('search-path');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('search-path').callsArgWith(1, new Error('oh noes'));

    const instance = websiteService(app, configReader, websiteInstance, glob.main, path);
    instance.findDefinitions('dir').catch((err) => {
        expect(err).toEqual(new Error('oh noes'));

        pathMock.verify();
        globMock.verify();

        done();
    });
};

const findDefinitionsTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('dir', '**/*.website.json').returns('search-path');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('search-path').callsArgWith(1, null, 'definitions');

    const instance = websiteService(app, configReader, websiteInstance, glob.main, path);
    instance.findDefinitions('dir').then((response) => {
        expect(response).toEqual('definitions');

        pathMock.verify();
        globMock.verify();

        done();
    });
};

const findTagsetsExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('dir', 'tagsets/**/*.json').returns('search-path');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('search-path').callsArgWith(1, new Error('oh noes'));

    const instance = websiteService(app, configReader, websiteInstance, glob.main, path);
    instance.findTagsets('dir').catch((err) => {
        expect(err).toEqual(new Error('oh noes'));

        pathMock.verify();
        globMock.verify();

        done();
    });
};

const findTagsetsTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('dir', 'tagsets/**/*.json').returns('search-path');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('search-path').callsArgWith(1, null, 'definitions');

    const instance = websiteService(app, configReader, websiteInstance, glob.main, path);
    instance.findTagsets('dir').then((response) => {
        expect(response).toEqual('definitions');

        pathMock.verify();
        globMock.verify();

        done();
    });
};

const initTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('dir', 'tagsets/**/*.json').returns('tagsets-path');
    pathMock.expects('join').once().withArgs('dir', '**/*.website.json').returns('websites-path');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('tagsets-path').callsArgWith(1, null, [
        'tagset'
    ]);
    globMock.expects('main').once().withArgs('websites-path').callsArgWith(1, null, [
        'website'
    ]);

    const configMock = sinon.mock(configReader);
    configMock.expects('readMainConfig').once().returns(Promise.resolve({
        main : 'config'
    }));
    configMock.expects('readDefinition').once().withArgs('tagset').returns(Promise.resolve([
        {
            tags : [
                'my-tag'
            ]
        }
    ]));
    configMock.expects('readDefinition').once().withArgs('website').returns(Promise.resolve({
        name : 'my-website'
    }));

    const websiteMock = sinon.mock(_websiteInstance);
    websiteMock.expects('init').once();

    const instance = websiteService(app, configReader, websiteInstance, glob.main, path);
    instance.init('dir').then(() => {
        pathMock.verify();
        globMock.verify();
        configMock.verify();
        websiteMock.verify();

        done();
    });
};

const initNoTagsets = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('dir', 'tagsets/**/*.json').returns('tagsets-path');
    pathMock.expects('join').once().withArgs('dir', '**/*.website.json').returns('websites-path');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('tagsets-path').callsArgWith(1, null, []);
    globMock.expects('main').once().withArgs('websites-path').callsArgWith(1, null, [
        'website'
    ]);

    const configMock = sinon.mock(configReader);
    configMock.expects('readMainConfig').once().returns(Promise.resolve({
        main : 'config'
    }));
    configMock.expects('readDefinition').once().withArgs('website').returns(Promise.resolve({
        name : 'my-website'
    }));

    const websiteMock = sinon.mock(_websiteInstance);
    websiteMock.expects('init').once();

    const instance = websiteService(app, configReader, websiteInstance, glob.main, path);
    instance.init('dir').then(() => {
        pathMock.verify();
        globMock.verify();
        configMock.verify();
        websiteMock.verify();

        done();
    });
};

const initClientTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('dir', 'tagsets/**/*.json').returns('tagsets-path');
    pathMock.expects('join').once().withArgs('dir', '**/*.website.json').returns('websites-path');
    pathMock.expects('join').once().withArgs('dir', '../identity', 'my-client.client.json').returns('identity-path');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('tagsets-path').callsArgWith(1, null, []);
    globMock.expects('main').once().withArgs('websites-path').callsArgWith(1, null, [
        'website'
    ]);

    const configMock = sinon.mock(configReader);
    configMock.expects('readMainConfig').once().returns(Promise.resolve({
        main : 'config'
    }));
    configMock.expects('readDefinition').once().withArgs('website').returns(Promise.resolve({
        name : 'my-website',
        client_id : 'my-client'
    }));
    configMock.expects('readDefinition').once().withArgs('identity-path').returns(Promise.resolve({
        name : 'my-client'
    }));

    const websiteMock = sinon.mock(_websiteInstance);
    websiteMock.expects('init').once();

    const instance = websiteService(app, configReader, websiteInstance, glob.main, path);
    instance.init('dir').then(() => {
        pathMock.verify();
        globMock.verify();
        configMock.verify();
        websiteMock.verify();

        done();
    });
};

const initMissingClientTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('dir', 'tagsets/**/*.json').returns('tagsets-path');
    pathMock.expects('join').once().withArgs('dir', '**/*.website.json').returns('websites-path');
    pathMock.expects('join').once().withArgs('dir', '../identity', 'my-client.client.json').returns('identity-path');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('tagsets-path').callsArgWith(1, null, []);
    globMock.expects('main').once().withArgs('websites-path').callsArgWith(1, null, [
        'website'
    ]);

    const configMock = sinon.mock(configReader);
    configMock.expects('readMainConfig').once().returns(Promise.resolve({
        main : 'config'
    }));
    configMock.expects('readDefinition').once().withArgs('website').returns(Promise.resolve({
        name : 'my-website',
        client_id : 'my-client'
    }));
    configMock.expects('readDefinition').once().withArgs('identity-path').returns(Promise.reject(new Error('not found')));

    const websiteMock = sinon.mock(_websiteInstance);
    websiteMock.expects('init').once();

    const instance = websiteService(app, configReader, websiteInstance, glob.main, path);
    instance.init('dir').then(() => {
        pathMock.verify();
        globMock.verify();
        configMock.verify();
        websiteMock.verify();

        done();
    });
};

describe('A website service', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('find definitions', () => {
        it('handles exceptions', findDefinitionsExceptionTest);
        it('works', findDefinitionsTest);
    });

    describe('find tagsets', () => {
        it('handles exceptions', findTagsetsExceptionTest);
        it('works', findTagsetsTest);
    });

    describe('init', () => {
        it('works', initTest);
        it('handles no tagsets', initNoTagsets);
        it('handles definitions with clients', initClientTest);
        it('handles definitions with missing clients', initMissingClientTest);
    });
});