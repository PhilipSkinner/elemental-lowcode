const
    sinon           = require('sinon'),
    secrets         = require('../../../src/service.kernel/lib/secrets');

const path = {
    join : () => {}
};

const fileLister = {
    executeGlob : () => {},
    readJSONFile : () => {},
};

const constructorTest = (done) => {
    const instance = secrets();
    expect(instance.fileLister).not.toBe(null);
    expect(instance.path).not.toBe(null);
    done();
};

const initTest = (done) => {
    process.env['IDENTITY_HOST'] = 'identity.com';

    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('config', '**/*.secret.json').returns('secret-glob');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('secret-glob').returns(Promise.resolve([{
        basename : 'my-secret'
    }, {
        basename : 'api-secret'
    }, {
        basename : 'exception'
    }]));
    fileMock.expects('readJSONFile').once().withArgs('config', 'my-secret').returns(Promise.resolve({
        name : 'super-secret',
        value : 'not-secret',
        scope : 'global'
    }));
    fileMock.expects('readJSONFile').once().withArgs('store', 'super-secret.secret.json').returns(Promise.resolve({
        value : 'pretty-secret'
    }));
    fileMock.expects('readJSONFile').once().withArgs('config', 'api-secret').returns(Promise.resolve({
        name : 'api-secret',
        value : 'not-secret',
        scope : 'system:api'
    }));
    fileMock.expects('readJSONFile').once().withArgs('store', 'api-secret.secret.json').returns(Promise.resolve({
        value : 'really-secret'
    }));
    fileMock.expects('readJSONFile').once().withArgs('config', 'exception').returns(Promise.resolve({
        name : 'exception',
    }));
    fileMock.expects('readJSONFile').once().withArgs('store', 'exception.secret.json').returns(Promise.reject(new Error('not good')));

    const instance = secrets('config', 'store', fileLister, path);

    instance.initSecrets('hello-world').then((results) => {
        expect(results).toEqual({
            admin: {
            SECRET: 'hello-world',
                'ELEMENTAL__ENV__super-secret': 'pretty-secret'
            },
            api: {
                'ELEMENTAL__ENV__super-secret': 'pretty-secret',
                'ELEMENTAL__ENV__api-secret' : 'really-secret'
            },
            integration: { 'ELEMENTAL__ENV__super-secret': 'pretty-secret' },
            website: { 'ELEMENTAL__ENV__super-secret': 'pretty-secret' },
            data: { 'ELEMENTAL__ENV__super-secret': 'pretty-secret' },
            rules: { 'ELEMENTAL__ENV__super-secret': 'pretty-secret' },
            identity: {
                SECRET: 'hello-world',
                DEBUG: 'oidc-provider:*',
                IDENTITY_HOST: 'identity.com',
                EXTERNAL_IDENTITY_HOST: undefined,
                'ELEMENTAL__ENV__super-secret': 'pretty-secret'
            },
            queues: { 'ELEMENTAL__ENV__super-secret': 'pretty-secret' }
        });

        pathMock.verify();
        fileMock.verify();

        process.env['IDENTITY_HOST'] = '';

        done();
    });
};

describe('A secrets provider', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('init', () => {
        it('returns the secrets', initTest);
    });
});