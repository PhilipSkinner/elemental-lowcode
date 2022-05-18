const
    sinon              = require('sinon'),
    termsController    = require('../../../../src/service.identity.idp/lib/controllers/termsController');

const provider = {
    interactionDetails : () => {},
    interactionFinished : () => {},
    Client : {
        find : () => {}
    }
};

const accountService = {
    findAccount : () => {},
    updateUser : () => {}
};

const clientHelper = {

};

const termsFormExceptions = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('request', 'response').returns(Promise.reject(new Error('oops')));

    const instance = termsController(provider, accountService, clientHelper);

    instance.showTermsForm('request', 'response', (err) => {
        expect(err).toEqual(new Error('oops'));

        providerMock.verify();

        done();
    });
};

const termsFormAlreadyAccepted = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('request', 'response').returns(Promise.resolve({
        session : {
            accountId : 1234
        },
        params : {
            client_id : 'my-client'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs('request', 'response', {
        select_account : {},
        login : {
            account : 1234
        }
    }, { mergeWithLastSubmission : false }).returns(Promise.resolve());

    const accountMock = sinon.mock(accountService);
    accountMock.expects('findAccount').once().withArgs(null, 1234).returns(Promise.resolve({
        profile : {
            claims : {
                terms : '1'
            }
        },
        accountId : 1234
    }));

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({
        features : {
            terms : {
                required : true,
                issue_to : 'terms',
                version : '1'
            }
        }
    }));

    const instance = termsController(provider, accountService);

    instance.showTermsForm('request', 'response');

    setTimeout(() => {
        providerMock.verify();
        accountMock.verify();
        clientMock.verify();

        done();
    }, 1);
};

const termsForm = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('request', sinon.match.any).returns(Promise.resolve({
        session : {
            accountId : 1234
        },
        params : {
            client_id : 'my-client'
        },
        prompt : {
            details : 'the-details'
        }
    }));

    const accountMock = sinon.mock(accountService);
    accountMock.expects('findAccount').once().withArgs(null, 1234).returns(Promise.resolve({
        profile : {
            claims : {
                terms : '1'
            }
        },
        accountId : 1234
    }));

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({
        features : {
            terms : {
                required : true,
                issue_to : 'terms',
                version : '2'
            }
        }
    }));

    const instance = termsController(provider, accountService);

    instance.showTermsForm('request', {
        render : (template, data) => {
            expect(template).toEqual('terms');
            expect(data).toEqual({
                client: {
                    features: {
                        terms : {
                            required : true,
                            issue_to : 'terms',
                            version : '2'
                        }
                    }
                },
                uid: undefined,
                details: 'the-details',
                params: {
                    client_id: 'my-client'
                },
                termsError: undefined,
                privacyError : undefined,
                termsRequired : true,
                privacyRequired : false,
                title: 'Terms & Conditions'
            });

            providerMock.verify();
            accountMock.verify();
            clientMock.verify();

            done();
        }
    });
};

const termsFormTermsErrors = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('request', sinon.match.any).returns(Promise.resolve({
        session : {
            accountId : 1234
        },
        params : {
            client_id : 'my-client'
        },
        prompt : {
            details : 'the-details'
        },
        lastSubmission : {
            termsError : true,
            privacyError : true
        }
    }));

    const accountMock = sinon.mock(accountService);
    accountMock.expects('findAccount').once().withArgs(null, 1234).returns(Promise.resolve({
        profile : {
            claims : {
                terms : '1'
            }
        },
        accountId : 1234
    }));

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({
        features : {
            terms : {
                required : true,
                issue_to : 'terms',
                version : '2'
            }
        }
    }));

    const instance = termsController(provider, accountService);

    instance.showTermsForm('request', {
        render : (template, data) => {
            expect(template).toEqual('terms');
            expect(data).toEqual({
                client: {
                    features: {
                        terms : {
                            required : true,
                            issue_to : 'terms',
                            version : '2'
                        }
                    }
                },
                uid: undefined,
                details: 'the-details',
                params: {
                    client_id: 'my-client'
                },
                termsError: true,
                privacyError : true,
                termsRequired : true,
                privacyRequired : false,
                title: 'Terms & Conditions'
            });

            providerMock.verify();
            accountMock.verify();
            clientMock.verify();

            done();
        }
    });
};

const handleTermsExceptions = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('request', 'response').returns(Promise.reject(new Error('oops')));

    const instance = termsController(provider, accountService, clientHelper);

    instance.handleTerms('request', 'response', (err) => {
        expect(err).toEqual(new Error('oops'));

        providerMock.verify();

        done();
    });
};

const handleTermsAlreadyAccepted = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('request', 'response').returns(Promise.resolve({
        session : {
            accountId : 1234
        },
        params : {
            client_id : 'my-client'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs('request', 'response', {
        select_account : {},
        login : {
            account : 1234
        }
    }, { mergeWithLastSubmission : false }).returns(Promise.resolve());

    const accountMock = sinon.mock(accountService);
    accountMock.expects('findAccount').once().withArgs(null, 1234).returns(Promise.resolve({
        profile : {
            claims : {
                terms : '1'
            }
        },
        accountId : 1234
    }));

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({
        features : {
            terms : {
                required : true,
                issue_to : 'terms',
                version : '1'
            }
        }
    }));

    const instance = termsController(provider, accountService);

    instance.handleTerms('request', 'response');

    setTimeout(() => {
        providerMock.verify();
        accountMock.verify();
        clientMock.verify();

        done();
    }, 1);
};

const handleTermsValidation = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, 'response').returns(Promise.resolve({
        session : {
            accountId : 1234
        },
        params : {
            client_id : 'my-client'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs(sinon.match.any, 'response', {
        prompt : 'terms',
        termsError : true,
        privacyError : false
    }, { mergeWithLastSubmission : false }).returns(Promise.resolve());

    const accountMock = sinon.mock(accountService);
    accountMock.expects('findAccount').once().withArgs(null, 1234).returns(Promise.resolve({
        profile : {
            claims : {
                terms : '1'
            }
        },
        accountId : 1234
    }));

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({
        features : {
            terms : {
                required : true,
                issue_to : 'terms',
                version : '2'
            }
        }
    }));

    const instance = termsController(provider, accountService);

    instance.handleTerms({
        body : {

        }
    }, 'response');

    setTimeout(() => {
        providerMock.verify();
        accountMock.verify();
        clientMock.verify();

        done();
    }, 1);
};

const handleTermsPrivacyValidation = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, 'response').returns(Promise.resolve({
        session : {
            accountId : 1234
        },
        params : {
            client_id : 'my-client'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs(sinon.match.any, 'response', {
        prompt : 'terms',
        termsError : false,
        privacyError : true
    }, { mergeWithLastSubmission : false }).returns(Promise.resolve());

    const accountMock = sinon.mock(accountService);
    accountMock.expects('findAccount').once().withArgs(null, 1234).returns(Promise.resolve({
        profile : {
            claims : {
                terms : '1'
            }
        },
        accountId : 1234
    }));

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({
        features : {
            privacy : {
                required : true,
                issue_to : 'terms',
                version : '2'
            }
        }
    }));

    const instance = termsController(provider, accountService);

    instance.handleTerms({
        body : {

        }
    }, 'response');

    setTimeout(() => {
        providerMock.verify();
        accountMock.verify();
        clientMock.verify();

        done();
    }, 1);
};

const handleTerms = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, 'response').returns(Promise.resolve({
        session : {
            accountId : 1234
        },
        params : {
            client_id : 'my-client'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs(sinon.match.any, 'response', {
        select_account : {},
        login : {
            account : 1234
        }
    }, { mergeWithLastSubmission : false }).returns(Promise.resolve());

    const accountMock = sinon.mock(accountService);
    accountMock.expects('findAccount').once().withArgs(null, 1234).returns(Promise.resolve({
        profile : {
            claims : {
                terms : '1'
            }
        },
        accountId : 1234
    }));
    accountMock.expects('updateUser').once().withArgs(1234, {
        claims : {
            terms : '2',
            implicit_consent : [
                'consent_1'
            ]
        }
    }).returns(Promise.resolve());

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({
        features : {
            terms : {
                required : true,
                issue_to : 'terms',
                version : '2',
                implicit_consents : [
                    'consent_1'
                ]
            }
        }
    }));

    const instance = termsController(provider, accountService);

    instance.handleTerms({
        body : {
            terms : true
        }
    }, 'response', (err) => {
        console.log(err);
    });

    setTimeout(() => {
        providerMock.verify();
        accountMock.verify();
        clientMock.verify();

        done();
    }, 1);
};

const handleTermsPrivacy = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, 'response').returns(Promise.resolve({
        session : {
            accountId : 1234
        },
        params : {
            client_id : 'my-client'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs(sinon.match.any, 'response', {
        select_account : {},
        login : {
            account : 1234
        }
    }, { mergeWithLastSubmission : false }).returns(Promise.resolve());

    const accountMock = sinon.mock(accountService);
    accountMock.expects('findAccount').once().withArgs(null, 1234).returns(Promise.resolve({
        profile : {
            claims : {
                terms : '1'
            }
        },
        accountId : 1234
    }));
    accountMock.expects('updateUser').once().withArgs(1234, {
        claims : {
            terms : '2',
            implicit_consent : [
                'consent_1'
            ]
        }
    }).returns(Promise.resolve());

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({
        features : {
            privacy : {
                required : true,
                issue_to : 'terms',
                version : '2',
                implicit_consents : [
                    'consent_1'
                ]
            }
        }
    }));

    const instance = termsController(provider, accountService);

    instance.handleTerms({
        body : {
            privacy : true
        }
    }, 'response', (err) => {
        console.log(err);
    });

    setTimeout(() => {
        providerMock.verify();
        accountMock.verify();
        clientMock.verify();

        done();
    }, 1);
};

const handleTermsExistingTerms = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, 'response').returns(Promise.resolve({
        session : {
            accountId : 1234
        },
        params : {
            client_id : 'my-client'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs(sinon.match.any, 'response', {
        select_account : {},
        login : {
            account : 1234
        }
    }, { mergeWithLastSubmission : false }).returns(Promise.resolve());

    const accountMock = sinon.mock(accountService);
    accountMock.expects('findAccount').once().withArgs(null, 1234).returns(Promise.resolve({
        profile : {
            claims : {
                terms : '2',
                implicit_consent : [
                    'consent_1'
                ]
            }
        },
        accountId : 1234
    }));
    accountMock.expects('updateUser').once().withArgs(1234, {
        claims : {
            terms : '2',
            privacy : '1',
            implicit_consent : [
                'consent_1',
                'data_1'
            ]
        }
    }).returns(Promise.resolve());

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({
        features : {
            privacy : {
                required : true,
                issue_to : 'privacy',
                version : '1',
                implicit_consents : [
                    'data_1'
                ]
            },
            terms : {
                required : true,
                issue_to : 'terms',
                version : '2',
                implicit_consents : [
                    'consent_1'
                ]
            }
        }
    }));

    const instance = termsController(provider, accountService);

    instance.handleTerms({
        body : {
            privacy : true
        }
    }, 'response', (err) => {
        console.log(err);
    });

    setTimeout(() => {
        providerMock.verify();
        accountMock.verify();
        clientMock.verify();

        done();
    }, 1);
};

const handleTermsExistingPrivacy = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, 'response').returns(Promise.resolve({
        session : {
            accountId : 1234
        },
        params : {
            client_id : 'my-client'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs(sinon.match.any, 'response', {
        select_account : {},
        login : {
            account : 1234
        }
    }, { mergeWithLastSubmission : false }).returns(Promise.resolve());

    const accountMock = sinon.mock(accountService);
    accountMock.expects('findAccount').once().withArgs(null, 1234).returns(Promise.resolve({
        profile : {
            claims : {
                terms : '1',
                privacy : '1',
                implicit_consent : [
                    'data_1'
                ]
            }
        },
        accountId : 1234
    }));
    accountMock.expects('updateUser').once().withArgs(1234, {
        claims : {
            terms : '2',
            privacy : '1',
            implicit_consent : [
                'consent_1',
                'data_1'
            ]
        }
    }).returns(Promise.resolve());

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({
        features : {
            privacy : {
                required : true,
                issue_to : 'privacy',
                version : '1',
                implicit_consents : [
                    'data_1'
                ]
            },
            terms : {
                required : true,
                issue_to : 'terms',
                version : '2',
                implicit_consents : [
                    'consent_1'
                ]
            }
        }
    }));

    const instance = termsController(provider, accountService);

    instance.handleTerms({
        body : {
            terms : true
        }
    }, 'response', (err) => {
        console.log(err);
    });

    setTimeout(() => {
        providerMock.verify();
        accountMock.verify();
        clientMock.verify();

        done();
    }, 1);
};

describe('A terms controller', () => {
    describe('show terms form', () => {
        it('handles exceptions', termsFormExceptions);
        it('handles already accepted terms', termsFormAlreadyAccepted);
        it('works', termsForm);
        it('handles terms errors', termsFormTermsErrors);
    });

    describe('handle terms', () => {
        it('handles exceptions', handleTermsExceptions);
        it('handles already accepted terms', handleTermsAlreadyAccepted);
        it('validates that terms have been accepted', handleTermsValidation);
        it('works', handleTerms);
        it('handles privacy', handleTermsPrivacy);
        it('validates that privacy has been read', handleTermsPrivacyValidation);
        it('adds new privacy to existing terms', handleTermsExistingTerms);
        it('adds new terms to existing privacy', handleTermsExistingPrivacy);
    });
});