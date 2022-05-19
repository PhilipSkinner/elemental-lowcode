const
    sinon 				= require('sinon'),
    controllerInstance 	= require('../../../src/service.interface/lib/controllerInstance');

const templateRenderer = {
    renderView : () => {}
};
const passport = {
    authenticate : () => {}
};
const tagControllers = {
    determineInstances : () => {}
};
const path = {
    join : () => {}
};
const fs = {
    readFile : () => {}
};
const controllerState = {
    main : () => {},
    setContext : () => {},
    setComponents : () => {},
    triggerEvent : () => {},
    generateResponseHeaders : () => {},
    getBag : () => {}
};
const roleCheckHandler = {
    enforceRoles : () => {}
};

const constructorTest = (done) => {
    const instance = controllerInstance();
    expect(instance.path).not.toBe(null);
    expect(instance.fs).not.toBe(null);
    expect(instance.controllerState).not.toBe(null);
    expect(instance.roleCheckHandler).not.toBe(null);
    done();
};

const loadViewExceptionTest = (done) => {
    const instance = controllerInstance({
        view : 'my-view'
    }, templateRenderer, {}, passport, tagControllers, path, fs, controllerState, roleCheckHandler);

    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, 'my-view').returns('path/to/my-view');

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('path/to/my-view').callsArgWith(1, new Error('bad times'), null);

    instance.loadView().catch((err) => {
        expect(err).toEqual(new Error('bad times'));

        pathMock.verify();
        fsMock.verify();

        done();
    });
};

const loadViewJSONExceptionTest = (done) => {
    const instance = controllerInstance({
        view : 'my-view'
    }, templateRenderer, {}, passport, tagControllers, path, fs, controllerState, roleCheckHandler);

    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, 'my-view').returns('path/to/my-view');

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('path/to/my-view').callsArgWith(1, null, '{}{}{}{}{}{SDSDSDW"£"£"£');

    instance.loadView().catch((err) => {
        expect(err).toEqual(new Error('Cannot load view my-view'));

        pathMock.verify();
        fsMock.verify();

        done();
    });
};

const loadViewNullDefinitionTest = (done) => {
    const instance = controllerInstance({
        view : 'my-view'
    }, templateRenderer, {}, passport, tagControllers, path, fs, controllerState, roleCheckHandler);

    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, 'my-view').returns('path/to/my-view');

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('path/to/my-view').callsArgWith(1, null, 'null');

    instance.loadView().catch((err) => {
        expect(err).toEqual(new Error('Cannot load view my-view'));

        pathMock.verify();
        fsMock.verify();

        done();
    });
};

const loadViewTest = (done) => {
    const instance = controllerInstance({
        view : 'my-view'
    }, templateRenderer, {}, passport, tagControllers, path, fs, controllerState, roleCheckHandler);

    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, 'my-view').returns('path/to/my-view');

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('path/to/my-view').callsArgWith(1, null, '{"hello":"world"}');

    instance.loadView().then((view) => {
        expect(view).toEqual({
            hello : 'world'
        });

        pathMock.verify();
        fsMock.verify();

        done();
    });
};

const handleExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    const controllerStateMock = sinon.mock(controllerState);
    const fsMock = sinon.mock(fs);
    const tagControllersMock = sinon.mock(tagControllers);
    const templateRendererMock = sinon.mock(templateRenderer);
    
    const req = {};
    const res = {};
    
    pathMock.expects('join').once().withArgs(process.cwd(), sinon.match.any, 'fs').returns('fs');
    pathMock.expects('join').once().withArgs(sinon.match.any, 'my-view').returns('path/to/my-view');    

    controllerStateMock.expects('main').once().returns(controllerState);
    controllerStateMock.expects('setContext').once().withArgs(req, res);

    fsMock.expects('readFile').once().withArgs('path/to/my-view').callsArgWith(1, new Error('oh noes'));

    const instance = controllerInstance({
        view : 'my-view',
        controller : 'fs'
    }, templateRenderer, {}, passport, tagControllers, path, fs, controllerState.main, roleCheckHandler);    

    instance.handler(req, res, (err) => {
        expect(err).toEqual(new Error('oh noes'));

        pathMock.verify();
        controllerStateMock.verify();
        fsMock.verify();

        done();
    });
};

const handleRequest = (done) => {
    const pathMock = sinon.mock(path);
    const controllerStateMock = sinon.mock(controllerState);
    const fsMock = sinon.mock(fs);
    const tagControllersMock = sinon.mock(tagControllers);
    const templateRendererMock = sinon.mock(templateRenderer);
    
    const req = {
        method : 'GET'
    };
    const res = {
        send : (html) => {
            expect(html).toEqual('some html');

            pathMock.verify();
            controllerStateMock.verify();
            fsMock.verify();
            tagControllersMock.verify();
            templateRendererMock.verify();

            done();
        }
    };
    
    pathMock.expects('join').once().withArgs(process.cwd(), sinon.match.any, 'fs').returns('fs');
    pathMock.expects('join').once().withArgs(sinon.match.any, 'my-view').returns('path/to/my-view');    

    fsMock.expects('readFile').once().withArgs('path/to/my-view').callsArgWith(1, null, '{"hello":"world"}');
    
    controllerStateMock.expects('main').once().returns(controllerState);
    controllerStateMock.expects('setContext').once().withArgs(req, res);
    controllerStateMock.expects('setComponents').once().withArgs(['instances']);
    controllerStateMock.expects('triggerEvent').once().withArgs('load', {}).returns(Promise.resolve());
    controllerStateMock.expects('generateResponseHeaders').once();
    controllerStateMock.expects('getBag').once().returns('my-bag');

    tagControllersMock.expects('determineInstances').once().withArgs({
        hello : 'world'
    }).returns(['instances']);

    templateRendererMock.expects('renderView').once().withArgs({
        hello : 'world'
    }, 'my-bag').returns(Promise.resolve('some html'));

    const instance = controllerInstance({
        view : 'my-view',
        controller : 'fs'
    }, templateRenderer, {}, passport, tagControllers, path, fs, controllerState.main, roleCheckHandler);    

    instance.handler(req, res);
};

const handleOtherRequest = (done) => {
    const pathMock = sinon.mock(path);
    const controllerStateMock = sinon.mock(controllerState);
    const fsMock = sinon.mock(fs);
    const tagControllersMock = sinon.mock(tagControllers);
    const templateRendererMock = sinon.mock(templateRenderer);
    
    const req = {};
    const res = {
        send : (html) => {
            expect(html).toEqual('some html');

            pathMock.verify();
            controllerStateMock.verify();
            fsMock.verify();
            tagControllersMock.verify();
            templateRendererMock.verify();

            done();
        }
    };
    
    pathMock.expects('join').once().withArgs(process.cwd(), sinon.match.any, 'fs').returns('fs');
    pathMock.expects('join').once().withArgs(sinon.match.any, 'my-view').returns('path/to/my-view');    

    fsMock.expects('readFile').once().withArgs('path/to/my-view').callsArgWith(1, null, '{"hello":"world"}');
    
    controllerStateMock.expects('main').once().returns(controllerState);
    controllerStateMock.expects('setContext').once().withArgs(req, res);
    controllerStateMock.expects('setComponents').once().withArgs(['instances']);
    controllerStateMock.expects('triggerEvent').once().withArgs('load', {}).returns(Promise.resolve());
    controllerStateMock.expects('generateResponseHeaders').once();
    controllerStateMock.expects('getBag').once().returns('my-bag');

    tagControllersMock.expects('determineInstances').once().withArgs({
        hello : 'world'
    }).returns(['instances']);

    templateRendererMock.expects('renderView').once().withArgs({
        hello : 'world'
    }, 'my-bag').returns(Promise.resolve('some html'));

    const instance = controllerInstance({
        view : 'my-view',
        controller : 'fs'
    }, templateRenderer, {}, passport, tagControllers, path, fs, controllerState.main, roleCheckHandler);    

    instance.handler(req, res);
};

const handleEarlyHeaders = (done) => {
    const pathMock = sinon.mock(path);
    const controllerStateMock = sinon.mock(controllerState);
    const fsMock = sinon.mock(fs);
    const tagControllersMock = sinon.mock(tagControllers);
    const templateRendererMock = sinon.mock(templateRenderer);
    
    const req = {};
    const res = {
        headersSent : true,
        send : (html) => {
            expect(html).toEqual('some html');

            pathMock.verify();
            controllerStateMock.verify();
            fsMock.verify();
            tagControllersMock.verify();
            templateRendererMock.verify();

            done();
        }
    };
    
    pathMock.expects('join').once().withArgs(process.cwd(), sinon.match.any, 'fs').returns('fs');
    pathMock.expects('join').once().withArgs(sinon.match.any, 'my-view').returns('path/to/my-view');    

    fsMock.expects('readFile').once().withArgs('path/to/my-view').callsArgWith(1, null, '{"hello":"world"}');
    
    controllerStateMock.expects('main').once().returns(controllerState);
    controllerStateMock.expects('setContext').once().withArgs(req, res);
    controllerStateMock.expects('setComponents').once().withArgs(['instances']);
    controllerStateMock.expects('generateResponseHeaders').once();
    controllerStateMock.expects('getBag').once().returns('my-bag');

    tagControllersMock.expects('determineInstances').once().withArgs({
        hello : 'world'
    }).returns(['instances']);

    templateRendererMock.expects('renderView').once().withArgs({
        hello : 'world'
    }, 'my-bag').returns(Promise.resolve('some html'));

    const instance = controllerInstance({
        view : 'my-view',
        controller : 'fs'
    }, templateRenderer, {}, passport, tagControllers, path, fs, controllerState.main, roleCheckHandler);    

    instance.handler(req, res);
};

const handleGetRequest = (done) => {
    const pathMock = sinon.mock(path);
    const controllerStateMock = sinon.mock(controllerState);
    const fsMock = sinon.mock(fs);
    const tagControllersMock = sinon.mock(tagControllers);
    const templateRendererMock = sinon.mock(templateRenderer);
    
    const req = {
        method : 'GET',
        query : {
            event : 'my-event'
        }
    };
    const res = {
        send : (html) => {
            expect(html).toEqual('some html');

            pathMock.verify();
            controllerStateMock.verify();
            fsMock.verify();
            tagControllersMock.verify();
            templateRendererMock.verify();

            done();
        }
    };
    
    pathMock.expects('join').once().withArgs(process.cwd(), sinon.match.any, 'fs').returns('fs');
    pathMock.expects('join').once().withArgs(sinon.match.any, 'my-view').returns('path/to/my-view');    

    fsMock.expects('readFile').once().withArgs('path/to/my-view').callsArgWith(1, null, '{"hello":"world"}');
    
    controllerStateMock.expects('main').once().returns(controllerState);
    controllerStateMock.expects('setContext').once().withArgs(req, res);
    controllerStateMock.expects('setComponents').once().withArgs(['instances']);
    controllerStateMock.expects('triggerEvent').once().withArgs('my-event', {
        event : 'my-event'
    }).returns(Promise.resolve());
    controllerStateMock.expects('triggerEvent').once().withArgs('load', {
        event : 'my-event'
    }).returns(Promise.resolve());
    controllerStateMock.expects('generateResponseHeaders').once();
    controllerStateMock.expects('getBag').once().returns('my-bag');

    tagControllersMock.expects('determineInstances').once().withArgs({
        hello : 'world'
    }).returns(['instances']);

    templateRendererMock.expects('renderView').once().withArgs({
        hello : 'world'
    }, 'my-bag').returns(Promise.resolve('some html'));

    const instance = controllerInstance({
        view : 'my-view',
        controller : 'fs'
    }, templateRenderer, {}, passport, tagControllers, path, fs, controllerState.main, roleCheckHandler);    

    instance.handler(req, res);
};

const handlePostRequest = (done) => {
    const pathMock = sinon.mock(path);
    const controllerStateMock = sinon.mock(controllerState);
    const fsMock = sinon.mock(fs);
    const tagControllersMock = sinon.mock(tagControllers);
    const templateRendererMock = sinon.mock(templateRenderer);
    
    const req = {
        method : 'POST',
        query : {
            _event : 'my-event'
        },
        body : {
            hello : 'world',
            'nested$$_$$value' : 'yes',
            'nested$$_$$another' : 'please'
        }
    };
    const res = {
        send : (html) => {
            expect(html).toEqual('some html');

            pathMock.verify();
            controllerStateMock.verify();
            fsMock.verify();
            tagControllersMock.verify();
            templateRendererMock.verify();

            done();
        }
    };
    
    pathMock.expects('join').once().withArgs(process.cwd(), sinon.match.any, 'fs').returns('fs');
    pathMock.expects('join').once().withArgs(sinon.match.any, 'my-view').returns('path/to/my-view');    

    fsMock.expects('readFile').once().withArgs('path/to/my-view').callsArgWith(1, null, '{"hello":"world"}');
    
    controllerStateMock.expects('main').once().returns(controllerState);
    controllerStateMock.expects('setContext').once().withArgs(req, res);
    controllerStateMock.expects('setComponents').once().withArgs(['instances']);
    controllerStateMock.expects('triggerEvent').once().withArgs('my-event', {
        hello : 'world',
        nested : {
            value : 'yes',
            another : 'please'
        }
    }).returns(Promise.resolve());
    controllerStateMock.expects('triggerEvent').once().withArgs('load', {
        _event : 'my-event'
    }).returns(Promise.resolve());
    controllerStateMock.expects('generateResponseHeaders').once();
    controllerStateMock.expects('getBag').once().returns('my-bag');

    tagControllersMock.expects('determineInstances').once().withArgs({
        hello : 'world'
    }).returns(['instances']);

    templateRendererMock.expects('renderView').once().withArgs({
        hello : 'world'
    }, 'my-bag').returns(Promise.resolve('some html'));

    const instance = controllerInstance({
        view : 'my-view',
        controller : 'fs'
    }, templateRenderer, {}, passport, tagControllers, path, fs, controllerState.main, roleCheckHandler);    

    instance.handler(req, res, (err) => {
        console.log(err);
        done();
    });
};

const handlePostDefaultEvent = (done) => {
    const pathMock = sinon.mock(path);
    const controllerStateMock = sinon.mock(controllerState);
    const fsMock = sinon.mock(fs);
    const tagControllersMock = sinon.mock(tagControllers);
    const templateRendererMock = sinon.mock(templateRenderer);
    
    const req = {
        method : 'POST',        
        body : {
            hello : 'world',
            'nested$$_$$value' : 'yes',
            'nested$$_$$another' : 'please'
        }
    };
    const res = {
        send : (html) => {
            expect(html).toEqual('some html');

            pathMock.verify();
            controllerStateMock.verify();
            fsMock.verify();
            tagControllersMock.verify();
            templateRendererMock.verify();

            done();
        }
    };
    
    pathMock.expects('join').once().withArgs(process.cwd(), sinon.match.any, 'fs').returns('fs');
    pathMock.expects('join').once().withArgs(sinon.match.any, 'my-view').returns('path/to/my-view');    

    fsMock.expects('readFile').once().withArgs('path/to/my-view').callsArgWith(1, null, '{"hello":"world"}');
    
    controllerStateMock.expects('main').once().returns(controllerState);
    controllerStateMock.expects('setContext').once().withArgs(req, res);
    controllerStateMock.expects('setComponents').once().withArgs(['instances']);
    controllerStateMock.expects('triggerEvent').once().withArgs('postback', {
        hello : 'world',
        nested : {
            value : 'yes',
            another : 'please'
        }
    }).returns(Promise.resolve());
    controllerStateMock.expects('triggerEvent').once().withArgs('load', {}).returns(Promise.resolve());
    controllerStateMock.expects('generateResponseHeaders').once();
    controllerStateMock.expects('getBag').once().returns('my-bag');

    tagControllersMock.expects('determineInstances').once().withArgs({
        hello : 'world'
    }).returns(['instances']);

    templateRendererMock.expects('renderView').once().withArgs({
        hello : 'world'
    }, 'my-bag').returns(Promise.resolve('some html'));

    const instance = controllerInstance({
        view : 'my-view',
        controller : 'fs'
    }, templateRenderer, {}, passport, tagControllers, path, fs, controllerState.main, roleCheckHandler);    

    instance.handler(req, res, (err) => {
        console.log(err);
        done();
    });
};

const handlePostJSONPayload = (done) => {
    const pathMock = sinon.mock(path);
    const controllerStateMock = sinon.mock(controllerState);
    const fsMock = sinon.mock(fs);
    const tagControllersMock = sinon.mock(tagControllers);
    const templateRendererMock = sinon.mock(templateRenderer);
    
    const req = {
        method : 'POST',        
        body : {
            __params : '{"hello":"world"}'            
        }
    };
    const res = {
        send : (html) => {
            expect(html).toEqual('some html');

            pathMock.verify();
            controllerStateMock.verify();
            fsMock.verify();
            tagControllersMock.verify();
            templateRendererMock.verify();

            done();
        }
    };
    
    pathMock.expects('join').once().withArgs(process.cwd(), sinon.match.any, 'fs').returns('fs');
    pathMock.expects('join').once().withArgs(sinon.match.any, 'my-view').returns('path/to/my-view');    

    fsMock.expects('readFile').once().withArgs('path/to/my-view').callsArgWith(1, null, '{"hello":"world"}');
    
    controllerStateMock.expects('main').once().returns(controllerState);
    controllerStateMock.expects('setContext').once().withArgs(req, res);
    controllerStateMock.expects('setComponents').once().withArgs(['instances']);
    controllerStateMock.expects('triggerEvent').once().withArgs('postback', {
        hello : 'world'        
    }).returns(Promise.resolve());
    controllerStateMock.expects('triggerEvent').once().withArgs('load', {}).returns(Promise.resolve());
    controllerStateMock.expects('generateResponseHeaders').once();
    controllerStateMock.expects('getBag').once().returns('my-bag');

    tagControllersMock.expects('determineInstances').once().withArgs({
        hello : 'world'
    }).returns(['instances']);

    templateRendererMock.expects('renderView').once().withArgs({
        hello : 'world'
    }, 'my-bag').returns(Promise.resolve('some html'));

    const instance = controllerInstance({
        view : 'my-view',
        controller : 'fs'
    }, templateRenderer, {}, passport, tagControllers, path, fs, controllerState.main, roleCheckHandler);    

    instance.handler(req, res, (err) => {
        console.log(err);
        done();
    });
};

const handlePostWithFiles = (done) => {
    const pathMock = sinon.mock(path);
    const controllerStateMock = sinon.mock(controllerState);
    const fsMock = sinon.mock(fs);
    const tagControllersMock = sinon.mock(tagControllers);
    const templateRendererMock = sinon.mock(templateRenderer);
    
    const req = {
        method : 'POST',        
        body : {
            hello : 'world',
            'nested$$_$$value' : 'yes',
            'nested$$_$$another' : 'please'
        },
        files : {
            fhello : 'world',
            'fnested$$_$$value' : 'yes',
            'fnested$$_$$another' : 'please'  
        }
    };
    const res = {
        send : (html) => {
            expect(html).toEqual('some html');

            pathMock.verify();
            controllerStateMock.verify();
            fsMock.verify();
            tagControllersMock.verify();
            templateRendererMock.verify();

            done();
        }
    };
    
    pathMock.expects('join').once().withArgs(process.cwd(), sinon.match.any, 'fs').returns('fs');
    pathMock.expects('join').once().withArgs(sinon.match.any, 'my-view').returns('path/to/my-view');    

    fsMock.expects('readFile').once().withArgs('path/to/my-view').callsArgWith(1, null, '{"hello":"world"}');
    
    controllerStateMock.expects('main').once().returns(controllerState);
    controllerStateMock.expects('setContext').once().withArgs(req, res);
    controllerStateMock.expects('setComponents').once().withArgs(['instances']);
    controllerStateMock.expects('triggerEvent').once().withArgs('postback', {
        hello : 'world',
        nested : {
            value : 'yes',
            another : 'please'
        },
        fhello : 'world',
        fnested : {
            value : 'yes',
            another : 'please'
        }
    }).returns(Promise.resolve());
    controllerStateMock.expects('triggerEvent').once().withArgs('load', {}).returns(Promise.resolve());
    controllerStateMock.expects('generateResponseHeaders').once();
    controllerStateMock.expects('getBag').once().returns('my-bag');

    tagControllersMock.expects('determineInstances').once().withArgs({
        hello : 'world'
    }).returns(['instances']);

    templateRendererMock.expects('renderView').once().withArgs({
        hello : 'world'
    }, 'my-bag').returns(Promise.resolve('some html'));

    const instance = controllerInstance({
        view : 'my-view',
        controller : 'fs'
    }, templateRenderer, {}, passport, tagControllers, path, fs, controllerState.main, roleCheckHandler);    

    instance.handler(req, res, (err) => {
        console.log(err);
        done();
    });
};

const handleRedirects = (done) => {
    const pathMock = sinon.mock(path);
    const controllerStateMock = sinon.mock(controllerState);
    const fsMock = sinon.mock(fs);
    const tagControllersMock = sinon.mock(tagControllers);
    const templateRendererMock = sinon.mock(templateRenderer);
    
    const req = {
        method : 'GET'        
    };
    const res = {
        statusCode : 302,
        end : () => {
            pathMock.verify();
            controllerStateMock.verify();
            fsMock.verify();
            tagControllersMock.verify();
            templateRendererMock.verify();

            done();
        }
    };
    
    pathMock.expects('join').once().withArgs(process.cwd(), sinon.match.any, 'fs').returns('fs');
    pathMock.expects('join').once().withArgs(sinon.match.any, 'my-view').returns('path/to/my-view');    

    fsMock.expects('readFile').once().withArgs('path/to/my-view').callsArgWith(1, null, '{"hello":"world"}');
    
    controllerStateMock.expects('main').once().returns(controllerState);
    controllerStateMock.expects('setContext').once().withArgs(req, res);
    controllerStateMock.expects('setComponents').once().withArgs(['instances']);
    controllerStateMock.expects('triggerEvent').once().withArgs('load', {}).returns(Promise.resolve());
    controllerStateMock.expects('generateResponseHeaders').once();    

    tagControllersMock.expects('determineInstances').once().withArgs({
        hello : 'world'
    }).returns(['instances']);    

    const instance = controllerInstance({
        view : 'my-view',
        controller : 'fs'
    }, templateRenderer, {}, passport, tagControllers, path, fs, controllerState.main, roleCheckHandler);    

    instance.handler(req, res);
};

const handleRedirectsWithSession = (done) => {
    const pathMock = sinon.mock(path);
    const controllerStateMock = sinon.mock(controllerState);
    const fsMock = sinon.mock(fs);
    const tagControllersMock = sinon.mock(tagControllers);
    const templateRendererMock = sinon.mock(templateRenderer);
    
    const req = {
        method : 'GET',
        session : {
            save : (cb) => {
                cb();
            }
        }    
    };
    const res = {
        statusCode : 302,
        end : () => {
            pathMock.verify();
            controllerStateMock.verify();
            fsMock.verify();
            tagControllersMock.verify();
            templateRendererMock.verify();

            done();
        }
    };
    
    pathMock.expects('join').once().withArgs(process.cwd(), sinon.match.any, 'fs').returns('fs');
    pathMock.expects('join').once().withArgs(sinon.match.any, 'my-view').returns('path/to/my-view');    

    fsMock.expects('readFile').once().withArgs('path/to/my-view').callsArgWith(1, null, '{"hello":"world"}');
    
    controllerStateMock.expects('main').once().returns(controllerState);
    controllerStateMock.expects('setContext').once().withArgs(req, res);
    controllerStateMock.expects('setComponents').once().withArgs(['instances']);
    controllerStateMock.expects('triggerEvent').once().withArgs('load', {}).returns(Promise.resolve());
    controllerStateMock.expects('generateResponseHeaders').once();    

    tagControllersMock.expects('determineInstances').once().withArgs({
        hello : 'world'
    }).returns(['instances']);    

    const instance = controllerInstance({
        view : 'my-view',
        controller : 'fs'
    }, templateRenderer, {}, passport, tagControllers, path, fs, controllerState.main, roleCheckHandler);    

    instance.handler(req, res);
};

const handleSecureRouteNeedAuth = (done) => {    
    const passportMock = sinon.mock(passport);
    
    const req = {
        session : {
            passport : {
                user : {
                    accessToken : null
                }
            }
        }
    };
    const res = {};
    
    passportMock.expects('authenticate').once().withArgs('oauth2').returns((req, res, next) => {
        expect(req).toEqual(req);
        expect(res).toEqual(res);

        passportMock.verify();

        done();
    });

    const instance = controllerInstance({
        view : 'my-view',
        controller : 'fs',
        secure : true
    }, templateRenderer, {}, passport, tagControllers, path, fs, controllerState.main, roleCheckHandler);    

    instance.handler(req, res);
};

const handleSecureRouteRBAC = (done) => {
    const roleCheckHandlerMock = sinon.mock(roleCheckHandler);
    
    const req = {
        session : {
            passport : {
                user : {
                    accessToken : 'my token'
                }
            }
        }
    };
    const res = {};

    roleCheckHandlerMock.expects('enforceRoles').once().withArgs(sinon.match.any, ['some', 'roles']).returns((req, res) => {
        expect(req).toEqual(req);
        expect(res).toEqual(res);

        roleCheckHandlerMock.verify();

        done();
    });  

    const instance = controllerInstance({
        view : 'my-view',
        controller : 'fs',
        secure : true,
        roles : 'some,roles'
    }, templateRenderer, {}, passport, tagControllers, path, fs, controllerState.main, roleCheckHandler);    

    instance.handler(req, res);
};

const handleSecureRouteNoRoles = (done) => {
    const pathMock = sinon.mock(path);
    const controllerStateMock = sinon.mock(controllerState);
    const fsMock = sinon.mock(fs);
    const tagControllersMock = sinon.mock(tagControllers);
    const templateRendererMock = sinon.mock(templateRenderer);
    
    const req = {
        method : 'GET',
        session : {
            passport : {
                user : {
                    accessToken : 'my token'
                }
            }
        }
    };
    const res = {
        send : (html) => {
            expect(html).toEqual('some html');

            pathMock.verify();
            controllerStateMock.verify();
            fsMock.verify();
            tagControllersMock.verify();
            templateRendererMock.verify();

            done();
        }
    };
    
    pathMock.expects('join').once().withArgs(process.cwd(), sinon.match.any, 'fs').returns('fs');
    pathMock.expects('join').once().withArgs(sinon.match.any, 'my-view').returns('path/to/my-view');    

    fsMock.expects('readFile').once().withArgs('path/to/my-view').callsArgWith(1, null, '{"hello":"world"}');
    
    controllerStateMock.expects('main').once().returns(controllerState);
    controllerStateMock.expects('setContext').once().withArgs(req, res);
    controllerStateMock.expects('setComponents').once().withArgs(['instances']);
    controllerStateMock.expects('triggerEvent').once().withArgs('load', {}).returns(Promise.resolve());
    controllerStateMock.expects('generateResponseHeaders').once();
    controllerStateMock.expects('getBag').once().returns('my-bag');

    tagControllersMock.expects('determineInstances').once().withArgs({
        hello : 'world'
    }).returns(['instances']);

    templateRendererMock.expects('renderView').once().withArgs({
        hello : 'world'
    }, 'my-bag').returns(Promise.resolve('some html'));

    const instance = controllerInstance({
        view : 'my-view',
        controller : 'fs',
        secure : true,
    }, templateRenderer, {}, passport, tagControllers, path, fs, controllerState.main, roleCheckHandler);    

    instance.handler(req, res);
};

const parseQueryTest = (done) => {
    const instance = controllerInstance();

    expect(instance.parseQuery({
        hello__0 : 1,
        hello__1 : 2,
        'world$$_$$0' : 1,
        'world$$_$$1' : 2,
        this__is__an__item : 'indeed',
        this__is__an__array__0 : 'quite',
        'this$$_$$is$$_$$also$$_$$item' : 'indeed',
        'this$$_$$is$$_$$also$$_$$array$$_$$0' : 'quite'
    })).toEqual({
        hello : [
            1,
            2
        ],
        world : [
            1,
            2
        ],
        this : {
            is : {
                an : {
                    item : 'indeed',
                    array : [
                        'quite'
                    ]
                },
                also : {
                    item : 'indeed',
                    array : [
                        'quite'
                    ]
                }
            }
        }
    });

    done();
};

const ensureArraysTest = (done) => {
    const instance = controllerInstance();

    expect(instance.ensureArrays({
        '0' : 1,
        '1' : 2
    })).toEqual([1, 2]);

    done();
};

describe('A controller instance', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('can load a view', () => {
        it('handling file read exceptions', loadViewExceptionTest);
        it('handling JSON load errors', loadViewJSONExceptionTest);
        it('handling null definitions', loadViewNullDefinitionTest);
        it('correctly', loadViewTest);
    });

    describe('can generate a handler', () => {
        it('handles exceptions', handleExceptionTest);
        it('that handles the request correctly', handleRequest);        
        it('handles other request correctly', handleOtherRequest);
        it('handles early headers', handleEarlyHeaders);
        it('handles get requests with events', handleGetRequest);
        it('handles post requests with events', handlePostRequest);
        it('handles post requests with default event', handlePostDefaultEvent);
        it('handles post requests with JSON payloads', handlePostJSONPayload);
        it('handles post requests with files', handlePostWithFiles);
        it('handles redirects', handleRedirects);
        it('handles redirects with session', handleRedirectsWithSession);
        it('handles secure routes - needs to authenticate', handleSecureRouteNeedAuth);
        it('handles secure routes - applying roles', handleSecureRouteRBAC);
        it('handles secure routes - no roles', handleSecureRouteNoRoles);
    });

    describe('can parse a query', () => {
        it('correctly', parseQueryTest);
    });

    describe('can ensure arrays', () => {
        it('correctly', ensureArraysTest);
    });
});