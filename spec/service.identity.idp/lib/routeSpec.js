const
    sinon          = require('sinon'),
    routes         = require('../../../src/service.identity.idp/lib/routes');

const app = {
    use : () => {},
    get : () => {},
    post : () => {},
    render : () => {}
};

const provider = {
    constructor : {
        errors : {
            SessionNotFound : function() {}
        }
    }
};

const interactionController = {
    handleInteraction : () => {},
};

const loginController = {
    showLoginForm : () => {},
    handleLogin : () => {}
};

const registerController = {
    showRegistrationForm : () => {},
    handleRegistration : () => {}
};

const consentController = {
    showConsent : () => {},
    confirmConsent : () => {}
};

const abortController = {
    abortRequest : () => {}
};

const constructorTest = (done) => {
    const instance = routes(app, provider);

    expect(instance.interactionController).not.toBe(undefined);
    expect(instance.loginController).not.toBe(undefined);
    expect(instance.registerController).not.toBe(undefined);
    expect(instance.consentController).not.toBe(undefined);
    expect(instance.abortController).not.toBe(undefined);

    done();
}

const initTest = (done) => {
    const appMock = sinon.mock(app);
    appMock.expects('use').twice().withArgs(sinon.match.any);

    const instance = routes(app, provider, interactionController, loginController, registerController, consentController, abortController);

    appMock.verify();

    done();
};

const noCacheTest = (done) => {
    const instance = routes(app, provider, interactionController, loginController, registerController, consentController, abortController);

    let calls = 0;
    instance.setNoCache('req', {
        set : (name, value) => {
            calls++;

            if (calls === 1) {
                expect(name).toEqual('Pragma');
                expect(value).toEqual('no-cache');
            }

            if (calls === 2) {
                expect(name).toEqual('Cache-Control');
                expect(value).toEqual('no-cache, no-store');
            }
        }
    }, () => {
        expect(calls).toEqual(2);
        done();
    });
};

const errorHandlerTest = (done) => {
    const instance = routes(app, provider, interactionController, loginController, registerController, consentController, abortController);

    instance.errorHandler(new Error('oops'), 'request', {
        render : (template, data) => {
            expect(template).toEqual('error');
            expect(data).toEqual({
                error : new Error('oops'),
                title : 'Error'
            });

            done();
        }
    });
};

const layoutTest = (done) => {
    const appMock = sinon.mock(app);
    appMock.expects('render').once().withArgs();

    const instance = routes(app, provider, interactionController, loginController, registerController, consentController, abortController);

    const res = {
        render : (template, data) => {

        }
    };

    instance.addLayout('req', res, () => {
        res.render('hello', { there : 'general kenobi' });

        appMock.verify();

        done();
    });
};

describe('A route provider', () => {
    it('defaults its constructor params', constructorTest);
    it('handles init', initTest);
    it('can set no-cache', noCacheTest);
    it('handles errors', errorHandlerTest);
    it('adds a layout', layoutTest);
});