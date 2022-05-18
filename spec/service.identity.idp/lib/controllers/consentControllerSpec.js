const
    sinon             = require('sinon'),
    consentController = require('../../../../src/service.identity.idp/lib/controllers/consentController');

const provider = {
    interactionDetails : () => {},
    interactionFinished : () => {},
    Client : {
        find : () => {}
    }
};

const accountService = {
    findAccount : () => {}
};

const clientHelper = {

};

const showConsentExceptions = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('request', 'response').returns(Promise.reject(new Error('not today')));

    const instance = consentController(provider, accountService, clientHelper);

    instance.showConsent('request', 'response', (err) => {
        expect(err).toEqual(new Error('not today'));

        providerMock.verify();

        done();
    });
};

const showConsentTerms = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('request', 'response').returns(Promise.resolve({
        params : {
            client_id : 'my-client'
        },
        uid : 'the-uid',
        prompt : {
            details : 'prompt-details'
        },
        session : {
            accountId : 1234
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs('request', 'response', {
        select_account : {},
        login : {
            account : 1234
        },
        prompt : 'terms'
    });

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({
        features : {
            terms : {
                version : '2',
                issue_to : 'terms'
            }
        }
    }));

    const accountMock = sinon.mock(accountService);
    accountMock.expects('findAccount').once().withArgs(null, 1234).returns(Promise.resolve({
        accountId : 1234,
        profile : {
            claims : {
                terms : '1'
            }
        }
    }));

    const instance = consentController(provider, accountService);

    instance.showConsent('request', 'response');

    setTimeout(() => {
        accountMock.verify();
        providerMock.verify();
        clientMock.verify();

        done();
    }, 1);
};

const showConsentTest = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('request', sinon.match.any).returns(Promise.resolve({
        params : {
            client_id : 'my-client'
        },
        uid : 'the-uid',
        prompt : {
            details : 'prompt-details'
        },
        session : {
            accountId : 1234
        }
    }));

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve('the-client'));

    const accountMock = sinon.mock(accountService);
    accountMock.expects('findAccount').once().withArgs(null, 1234).returns(Promise.resolve({
        accountId : 1234
    }))

    const instance = consentController(provider, accountService);

    instance.showConsent('request', {
        render : (template, data) => {
            expect(template).toEqual('consents');
            expect(data).toEqual({
                client  : 'the-client',
                uid     : 'the-uid',
                details : 'prompt-details',
                params  : {
                    client_id : 'my-client'
                },
                title   : 'Authorize'
            })

            accountMock.verify();
            providerMock.verify();
            clientMock.verify();

            done();
        }
    });
};

const confirmExceptions = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('request', 'response').returns(Promise.reject(new Error('not today')));

    const instance = consentController(provider, accountService);

    instance.confirmConsent('request', 'response', (err) => {
        expect(err).toEqual(new Error('not today'));

        providerMock.verify();

        done();
    });
};

const confirmInvalidPage = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, sinon.match.any).returns(Promise.resolve({
        prompt : {
            name : 'not-consents'
        }
    }));

    const instance = consentController(provider, accountService);

    instance.confirmConsent({
        params : {
            uid : 'the-uid'
        }
    }, {
        redirect : (url) => {
            expect(url).toEqual('/interaction/the-uid');

            providerMock.verify();

            done();
        }
    });
};

const confirmTest = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('request', 'response').returns(Promise.resolve({
        prompt : {
            name : 'consent'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs('request', 'response', {
        consent : {
            rejectedScopes  : [],
            rejectedClaims  : [],
            replace         : false
        }
    }, {
        mergeWithLastSubmission : true
    });

    const instance = consentController(provider, accountService);

    instance.confirmConsent('request', 'response');

    setTimeout(() => {
        providerMock.verify();
        done();
    }, 1);
};

describe('A consents controller', () => {
    describe('can show consents', () => {
        it('handling exceptions', showConsentExceptions);
        it('redirects to terms if terms are required', showConsentTerms);
        it('correctly', showConsentTest);
    });

    describe('can confirm consents', () => {
        it('handling exceptions', confirmExceptions);
        it('handling invalid pages', confirmInvalidPage);
        it('correctly', confirmTest);
    });
});