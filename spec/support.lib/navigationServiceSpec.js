const
    sinon 				= require('sinon'),
    navigationService 	= require('../../src/support.lib/navigationService');

const constructorTest = (done) => {
    const instance = navigationService();
    done();
};

const navigateToTest = (done) => {
    const instance = navigationService();

    instance.navigateTo('somewhere');
    expect(instance.url).toEqual('somewhere');

    done();
};

const contextTest = (done) => {
    const instance = navigationService();

    instance.setContext('req', 'res');
    expect(instance.request).toEqual('req');
    expect(instance.response).toEqual('res');

    done();
};

const redirectsTest = (done) => {
    const instance = navigationService();

    instance.navigateTo('somewhere');
    instance.setContext(null, {
        status : (code) => {
            expect(code).toEqual(302);
            done();
        },
        setHeader : (name, value) => {
            expect(name).toEqual('Location');
            expect(value).toEqual('somewhere');
        }
    });
    instance.generateResponseHeaders();
};

const noopHeaderTest = (done) => {
    const instance = navigationService();

    instance.generateResponseHeaders();

    done();
};

describe('A db provider', () => {
    it('defaults its constructor arguments', constructorTest);
    it('can navigate to', navigateToTest);
    it('can set its context', contextTest);

    describe('response headers', () => {
        it('supports redirects', redirectsTest);
        it('noop', noopHeaderTest);
    });
});