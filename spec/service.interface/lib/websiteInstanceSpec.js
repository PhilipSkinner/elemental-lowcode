const
    sinon 			= require('sinon'),
    websiteInstance = require('../../../src/service.interface/lib/websiteInstance');

const app = {
    use : () => {}
};

const controllerInstance = {
    main : () => {},
    handler : () => {}
};

const templateRenderer = {

};

const tagControllers = {

};

const express = {

};

const path = {

};

const hostnameResolver = {

};

const dataResolver = {

};

const environmentService = {

};

const sqlSessionStore = {

};

const passport = {

};

const constructorTest = (done) => {
    const instance = websiteInstance();
    expect(instance.controllerInstance).not.toBe(null);
    expect(instance.templateRenderer).not.toBe(null);
    expect(instance.express).not.toBe(null);
    expect(instance.path).not.toBe(null);
    expect(instance.hostnameResolver).not.toBe(null);
    done();
};

const errorHandlerNoConfig = (done) => {
    const appMock = sinon.mock(app);
    let calls = 0;
    appMock.expects('use').once().callsArgWith(1, {}, {}, () => {
        calls++;
    });
    appMock.expects('use').once().callsArgWith(1, 'hello', {}, {}, (err) => {
        expect(err).toEqual('hello');
        expect(calls).toEqual(1);

        appMock.verify();

        done();
    });

    const instance = websiteInstance(app, {

    }, controllerInstance.main, templateRenderer, express, path, hostnameResolver, dataResolver, environmentService, sqlSessionStore, tagControllers);

    instance.configureErrorHandler(passport);
};

const errorHandlerNoHandles = (done) => {
    const appMock = sinon.mock(app);
    let calls = 0;
    appMock.expects('use').once().callsArgWith(1, {}, {}, () => {
        calls++;
    });
    appMock.expects('use').once().callsArgWith(1, 'hello', {}, {}, (err) => {
        expect(err).toEqual('hello');
        expect(calls).toEqual(1);

        appMock.verify();

        done();
    });

    const instance = websiteInstance(app, {
        errorHandlers : {
            oops : {
                name : 'should not work'
            }
        }
    }, controllerInstance.main, templateRenderer, express, path, hostnameResolver, dataResolver, environmentService, sqlSessionStore, tagControllers);

    instance.configureErrorHandler(passport);
};

const errorHandlerHeadersSent = (done) => {
    const appMock = sinon.mock(app);
    let calls = 0;
    appMock.expects('use').once().callsArgWith(1, {}, {
        headersSent : true
    }, () => {
        calls++;
    });
    appMock.expects('use').once().callsArgWith(1, 'hello', {}, {}, (err) => {
        expect(err).toEqual('hello');
        expect(calls).toEqual(1);

        appMock.verify();

        done();
    });

    const instance = websiteInstance(app, {

    }, controllerInstance.main, templateRenderer, express, path, hostnameResolver, dataResolver, environmentService, sqlSessionStore, tagControllers);

    instance.configureErrorHandler(passport);
};

const errorHandlerNotFound = (done) => {
    const appMock = sinon.mock(app);
    appMock.expects('use').once().callsArgWith(1, {}, {
        statusCode : 200,
        headersSent : false
    }, () => {
        expect(true).toBe(false);
    });
    appMock.expects('use').once();

    const controllerMock = sinon.mock(controllerInstance);
    controllerMock.expects('main').once().withArgs({
        handles : [
            404
        ]
    }).returns(controllerInstance);
    controllerMock.expects('handler').once().withArgs({}, {
        statusCode : 404,
        headersSent : false
    });

    const instance = websiteInstance(app, {
        errorHandlers : {
            notFound : {
                handles : [
                    404
                ]
            }
        }
    }, controllerInstance.main, templateRenderer, express, path, hostnameResolver, dataResolver, environmentService, sqlSessionStore, tagControllers);

    instance.configureErrorHandler(passport);

    setTimeout(() => {
        appMock.verify();
        controllerMock.verify();

        done();
    }, 1);
};

const errorHandlerDuplicateNotFound = (done) => {
    const appMock = sinon.mock(app);
    appMock.expects('use').once().callsArgWith(1, {}, {
        statusCode : 200,
        headersSent : false
    }, () => {
        expect(true).toBe(false);
    });
    appMock.expects('use').once();

    const controllerMock = sinon.mock(controllerInstance);
    controllerMock.expects('main').once().withArgs({
        name : 'one',
        handles : [
            404,
            401
        ]
    }).returns(controllerInstance);
    controllerMock.expects('handler').once().withArgs({}, {
        statusCode : 404,
        headersSent : false
    });

    const instance = websiteInstance(app, {
        errorHandlers : {
            notFound : {
                name : 'one',
                handles : [
                    404,
                    401
                ]
            },
            duplicate : {
                name : 'two',
                handles : [
                    404
                ]
            }
        }
    }, controllerInstance.main, templateRenderer, express, path, hostnameResolver, dataResolver, environmentService, sqlSessionStore, tagControllers);

    instance.configureErrorHandler(passport);

    setTimeout(() => {
        appMock.verify();
        controllerMock.verify();

        done();
    }, 1);
};

const errorHandlerTest = (done) => {
    const appMock = sinon.mock(app);
    appMock.expects('use').once();
    appMock.expects('use').once().callsArgWith(1, {
        status : 500
    }, {
        params : {}
    }, {}, () => {
        expect(true).toBe(false);
    });

    const controllerMock = sinon.mock(controllerInstance);
    controllerMock.expects('main').once().withArgs({
        handles : [
            500
        ]
    }).returns(controllerInstance);
    controllerMock.expects('handler').once().withArgs({
        params : {
            error : {
                status : 500
            }
        }
    }, {
        statusCode : 500
    });

    const instance = websiteInstance(app, {
        errorHandlers : {
            notFound : {
                handles : [
                    500
                ]
            }
        }
    }, controllerInstance.main, templateRenderer, express, path, hostnameResolver, dataResolver, environmentService, sqlSessionStore, tagControllers);

    instance.configureErrorHandler(passport);

    setTimeout(() => {
        appMock.verify();
        controllerMock.verify();

        done();
    }, 1);
};

const errorHandlerStatusCodeTest = (done) => {
    const appMock = sinon.mock(app);
    appMock.expects('use').once();
    appMock.expects('use').once().callsArgWith(1, {
        status : 500,
        statusCode : 501
    }, {
        params : {}
    }, {}, () => {
        expect(true).toBe(false);
    });

    const controllerMock = sinon.mock(controllerInstance);
    controllerMock.expects('main').once().withArgs({
        handles : [
            501
        ]
    }).returns(controllerInstance);
    controllerMock.expects('handler').once().withArgs({
        params : {
            error : {
                status : 500,
                statusCode : 501
            }
        }
    }, {
        statusCode : 501
    });

    const instance = websiteInstance(app, {
        errorHandlers : {
            notFound : {
                handles : [
                    501
                ]
            }
        }
    }, controllerInstance.main, templateRenderer, express, path, hostnameResolver, dataResolver, environmentService, sqlSessionStore, tagControllers);

    instance.configureErrorHandler(passport);

    setTimeout(() => {
        appMock.verify();
        controllerMock.verify();

        done();
    }, 1);
};

const errorHandlerDefaultTest = (done) => {
    const appMock = sinon.mock(app);
    appMock.expects('use').once();
    appMock.expects('use').once().callsArgWith(1, null, {
        params : {}
    }, {}, () => {
        expect(true).toBe(false);
    });

    const controllerMock = sinon.mock(controllerInstance);
    controllerMock.expects('main').once().withArgs({
        handles : [
            500
        ]
    }).returns(controllerInstance);
    controllerMock.expects('handler').once().withArgs({
        params : {
            error : null
        }
    }, {
        statusCode : 500
    });

    const instance = websiteInstance(app, {
        errorHandlers : {
            notFound : {
                handles : [
                    500
                ]
            }
        }
    }, controllerInstance.main, templateRenderer, express, path, hostnameResolver, dataResolver, environmentService, sqlSessionStore, tagControllers);

    instance.configureErrorHandler(passport);

    setTimeout(() => {
        appMock.verify();
        controllerMock.verify();

        done();
    }, 1);
};

describe('A website instance', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('configureErrorHandler', () => {
        it('handles errors as normal with no config', errorHandlerNoConfig);
        it('ignores handlers with no handles', errorHandlerNoHandles);
        it('ignores requests if the headers have already been sent', errorHandlerHeadersSent);
        it('supports 404s', errorHandlerNotFound);
        it('ignores duplicate 404 handlers', errorHandlerDuplicateNotFound);
        it('supports other errors', errorHandlerTest);
        it('supports other errors, using statusCode', errorHandlerStatusCodeTest);
        it('defaults to 500 with no error', errorHandlerDefaultTest);
    });
});