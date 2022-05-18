const
    sinon                   = require('sinon'),
    interactionController   = require('../../../../src/service.identity.idp/lib/controllers/interactionController');

const provider = {
    interactionDetails : () => {}
};

const handleInteractionExceptions = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('request', 'response').returns(Promise.reject(new Error('not today')));

    const instance = interactionController(provider);

    instance.handleInteraction('request', 'response', (err) => {
        expect(err).toEqual(new Error('not today'));

        providerMock.verify();

        done();
    });
};

const handleInteractionLogin = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, sinon.match.any).returns(Promise.resolve({
        prompt : {
            name : 'login'
        },
    }));

    const instance = interactionController(provider);

    instance.handleInteraction({
        params : {
            uid : 'the-uid'
        }
    }, {
        redirect : (url) => {
            expect(url).toEqual('/interaction/the-uid/login');

            providerMock.verify();

            done();
        }
    });
};

const handleInteractionRegister = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, sinon.match.any).returns(Promise.resolve({
        prompt : {
            name : 'register'
        },
    }));

    const instance = interactionController(provider);

    instance.handleInteraction({
        params : {
            uid : 'the-uid'
        }
    }, {
        redirect : (url) => {
            expect(url).toEqual('/interaction/the-uid/register');

            providerMock.verify();

            done();
        }
    });
};

const handleInteractionConsent = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, sinon.match.any).returns(Promise.resolve({
        prompt : {
            name : 'consent'
        },
    }));

    const instance = interactionController(provider);

    instance.handleInteraction({
        params : {
            uid : 'the-uid'
        }
    }, {
        redirect : (url) => {
            expect(url).toEqual('/interaction/the-uid/consent');

            providerMock.verify();

            done();
        }
    });
};

const handleInteractionTerms = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, sinon.match.any).returns(Promise.resolve({
        prompt : {
            name : 'terms'
        },
    }));

    const instance = interactionController(provider);

    instance.handleInteraction({
        params : {
            uid : 'the-uid'
        }
    }, {
        redirect : (url) => {
            expect(url).toEqual('/interaction/the-uid/terms');

            providerMock.verify();

            done();
        }
    });
};

const handleInteractionPassword = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, sinon.match.any).returns(Promise.resolve({
        prompt : {
            name : 'password'
        },
    }));

    const instance = interactionController(provider);

    instance.handleInteraction({
        params : {
            uid : 'the-uid'
        }
    }, {
        redirect : (url) => {
            expect(url).toEqual('/interaction/the-uid/password');

            providerMock.verify();

            done();
        }
    });
};

const handleInteractionForgotten = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, sinon.match.any).returns(Promise.resolve({
        prompt : {
            name : 'forgotten'
        },
    }));

    const instance = interactionController(provider);

    instance.handleInteraction({
        params : {
            uid : 'the-uid'
        }
    }, {
        redirect : (url) => {
            expect(url).toEqual('/interaction/the-uid/forgotten');

            providerMock.verify();

            done();
        }
    });
};

const handleInteractionCode = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, sinon.match.any).returns(Promise.resolve({
        prompt : {
            name : 'code'
        },
    }));

    const instance = interactionController(provider);

    instance.handleInteraction({
        params : {
            uid : 'the-uid'
        }
    }, {
        redirect : (url) => {
            expect(url).toEqual('/interaction/the-uid/code');

            providerMock.verify();

            done();
        }
    });
};

const handleInteractionAbort = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, sinon.match.any).returns(Promise.resolve({
        prompt : {
            name : 'what'
        },
        lastSubmission : {
            prompt : 'is this?'
        }
    }));

    const instance = interactionController(provider);

    instance.handleInteraction({
        params : {
            uid : 'the-uid'
        }
    }, {
        redirect : (url) => {
            expect(url).toEqual('/interaction/the-uid/abort');

            providerMock.verify();

            done();
        }
    });
};

describe('An interaction controller', () => {
    describe('handle interaction', () => {
        it('handles exceptions', handleInteractionExceptions);
        it('can redirect to login', handleInteractionLogin);
        it('can redirect to register', handleInteractionRegister);
        it('can redirect to consent', handleInteractionConsent);
        it('can redirect to terms', handleInteractionTerms);
        it('can redirect to password', handleInteractionPassword);
        it('can redirect to forgotten', handleInteractionForgotten);
        it('can redirect to code', handleInteractionCode);
        it('can redirect to abort by default', handleInteractionAbort);
    });
});