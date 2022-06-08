const
    sinon              = require('sinon'),
    registerController = require('../../../../src/service.identity.idp/lib/controllers/registerController');

const provider = {
    interactionDetails : () => {},
    interactionFinished : () => {},
    Client : {
        find : () => {}
    }
};

const accountService = {
    registerUser : () => {}
};

const clientHelper = {
    registrationEnabled : () => {},
    getPasswordRules : () => {},
    getBannedPasswords : () => {},
    getPasswordHelpers : () => {}
};

const passwordHelper = {
    passwordStrongEnough : () => {},
    isBannedPassword : () => {}
};

const emailValidator = {
    validate : () => {}
};

const showRegistrationFormExceptions = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('request', 'response').returns(Promise.reject(new Error('oh noes')));

    const instance = registerController(provider, accountService, clientHelper);
    instance.showRegistrationForm('request', 'response', (err) => {
        expect(err).toEqual(new Error('oh noes'));

        providerMock.verify();

        done();
    });
};

const showRegistrationFormDisabled = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('request', 'response').returns(Promise.resolve({
        params : {
            client_id : 'my-client'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs('request', 'response', {
        prompt : 'login'
    }, {
        mergeWithLastSubmission : false
    }).returns(Promise.resolve());

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({
        features : {
            registration : {
                enabled : false
            }
        }
    }));

    const instance = registerController(provider, accountService);
    instance.showRegistrationForm('request', 'response');

    setTimeout(() => {
        providerMock.verify();
        clientMock.verify();

        done();
    }, 1);
};

const showRegistrationFormTest = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('request', sinon.match.any).returns(Promise.resolve({
        params : {
            client_id : 'my-client'
        },
        uid : 'the-uid',
        prompt : {

        },
        lastSubmission : {
            duplicate : 'duplicate-value',
            details : 'the-details'
        }
    }));

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({
        features : {
            registration : {
                enabled : true
            },
            password : {
                helpers : 'some-helpers'
            }
        }
    }));

    const instance = registerController(provider, accountService);
    instance.showRegistrationForm('request', {
        render : (template, data) => {
            expect(template).toEqual('register');
            expect(data).toEqual({
                oidcclient : {
                    features : {
                        registration : {
                            enabled : true
                        },
                        password : {
                            helpers : 'some-helpers'
                        }
                    }
                },
                passwordHelpers : 'some-helpers',
                uid : 'the-uid',
                details : 'the-details',
                params : {
                    client_id : 'my-client'
                },
                duplicate : 'duplicate-value',
                title : 'Register',
                passwordError : undefined
            })

            providerMock.verify();
            clientMock.verify();

            done();
        }
    });
};

const handleRegistrationExceptions = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('request', 'response').returns(Promise.reject(new Error('oh noes')));

    const instance = registerController(provider, accountService, clientHelper);
    instance.handleRegistration('request', 'response', (err) => {
        expect(err).toEqual(new Error('oh noes'));

        providerMock.verify();

        done();
    });
};

const handleRegistrationDisabled = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('request', 'response').returns(Promise.resolve({
        params : {
            client_id : 'my-client'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs('request', 'response', {
        prompt : 'login'
    }, {
        mergeWithLastSubmission : false
    }).returns(Promise.resolve());

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({
        features : {
            registration : {
                enabled : false
            }
        }
    }));

    const instance = registerController(provider, accountService);
    instance.handleRegistration('request', 'response');

    setTimeout(() => {
        providerMock.verify();
        clientMock.verify();

        done();
    }, 1);
};

const handleRegistrationNoUsername = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, 'response').returns(Promise.resolve({
        params : {
            client_id : 'my-client'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs(sinon.match.any, 'response', {
        select_account : {},
        prompt : 'register',
        password_error : 'You must provide a username.',
        details : {
            username : '             ',
        },
        login : {
            account : null
        }
    }, {
        mergeWithLastSubmission : false
    }).returns(Promise.resolve());

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({
        features : {
            registration : {
                enabled : true
            }
        }
    }));

    const accountMock = sinon.mock(accountService);

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('registrationEnabled').once().returns(true);

    const instance = registerController(provider, accountService, clientHelper, passwordHelper);
    instance.handleRegistration({
        body : {
            login : '             ',
            password : 'password'
        }
    }, 'response');

    setTimeout(() => {
        providerMock.verify();
        clientMock.verify();
        accountMock.verify();
        clientHelperMock.verify();

        done();
    }, 1);
};

const handleRegistrationNotEmail = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, 'response').returns(Promise.resolve({
        params : {
            client_id : 'my-client'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs(sinon.match.any, 'response', {
        select_account : {},
        prompt : 'register',
        password_error : 'You did not enter a correctly formatted email address.',
        details : {
            username : 'not-an-email',
        },
        login : {
            account : null
        }
    }, {
        mergeWithLastSubmission : false
    }).returns(Promise.resolve());

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({
        features : {
            registration : {
                enabled : true
            }
        }
    }));

    const accountMock = sinon.mock(accountService);

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('registrationEnabled').once().returns(true);

    const emailMock = sinon.mock(emailValidator);
    emailMock.expects('validate').once().withArgs('not-an-email').returns(false);

    const instance = registerController(provider, accountService, clientHelper, passwordHelper, emailValidator);
    instance.handleRegistration({
        body : {
            login : 'not-an-email',
            password : 'password'
        }
    }, 'response');

    setTimeout(() => {
        providerMock.verify();
        clientMock.verify();
        accountMock.verify();
        clientHelperMock.verify();
        emailMock.verify();

        done();
    }, 1);
};

const handleRegistrationWeakPassword = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, 'response').returns(Promise.resolve({
        params : {
            client_id : 'my-client'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs(sinon.match.any, 'response', {
        select_account : {},
        prompt : 'register',
        password_error : 'oh noes',
        details : {
            username : 'username',
        },
        login : {
            account : null
        }
    }, {
        mergeWithLastSubmission : false
    }).returns(Promise.resolve());

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({
        features : {
            registration : {
                enabled : true
            }
        }
    }));

    const accountMock = sinon.mock(accountService);

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('registrationEnabled').once().returns(true);
    clientHelperMock.expects('getPasswordRules').once().returns({
        error : 'oh noes'
    });

    const passwordHelperMock = sinon.mock(passwordHelper);
    passwordHelperMock.expects('passwordStrongEnough').withArgs(sinon.match.any, 'password').returns(false);

    const emailMock = sinon.mock(emailValidator);
    emailMock.expects('validate').once().withArgs('username').returns(true);

    const instance = registerController(provider, accountService, clientHelper, passwordHelper, emailValidator);
    instance.handleRegistration({
        body : {
            login : 'username',
            password : 'password'
        }
    }, 'response');

    setTimeout(() => {
        providerMock.verify();
        clientMock.verify();
        accountMock.verify();
        clientHelperMock.verify();
        passwordHelperMock.verify();
        emailMock.verify();

        done();
    }, 1);
};

const handleRegistrationBannedPassword = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, 'response').returns(Promise.resolve({
        params : {
            client_id : 'my-client'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs(sinon.match.any, 'response', {
        select_account : {},
        prompt : 'register',
        password_error: 'That password is not allowed - it has been banned.',
        details : {
            username : 'username',
        },
        login : {
            account : null
        }
    }, {
        mergeWithLastSubmission : false
    }).returns(Promise.resolve());

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({
        features : {
            registration : {
                enabled : true
            }
        }
    }));

    const accountMock = sinon.mock(accountService);

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('registrationEnabled').once().returns(true);
    clientHelperMock.expects('getPasswordRules').once().returns({
        error : 'oh noes'
    });
    clientHelperMock.expects('getBannedPasswords').once().returns('banned-passwords');

    const passwordHelperMock = sinon.mock(passwordHelper);
    passwordHelperMock.expects('passwordStrongEnough').withArgs(sinon.match.any, 'password').returns(true);
    passwordHelperMock.expects('isBannedPassword').withArgs('banned-passwords', 'password').returns(true);

    const emailMock = sinon.mock(emailValidator);
    emailMock.expects('validate').once().withArgs('username').returns(true);

    const instance = registerController(provider, accountService, clientHelper, passwordHelper, emailValidator);
    instance.handleRegistration({
        body : {
            login : 'username',
            password : 'password'
        }
    }, 'response');

    setTimeout(() => {
        providerMock.verify();
        clientMock.verify();
        accountMock.verify();
        clientHelperMock.verify();
        passwordHelperMock.verify();
        emailMock.verify();

        done();
    }, 1);
};

const handleRegistrationDuplicates = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, 'response').returns(Promise.resolve({
        params : {
            client_id : 'my-client'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs(sinon.match.any, 'response', {
        select_account : {},
        prompt : 'register',
        duplicate : true,
        details : {
            username : 'username'
        },
        login : {
            account : null
        }
    }, {
        mergeWithLastSubmission : false
    }).returns(Promise.resolve());

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({
        features : {
            registration : {
                enabled : true
            }
        }
    }));

    const accountMock = sinon.mock(accountService);
    accountMock.expects('registerUser').once().withArgs('username', 'password').returns(Promise.resolve(null));

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('registrationEnabled').once().returns(true);
    clientHelperMock.expects('getPasswordRules').once().returns({
        error : 'oh noes'
    });

    const passwordHelperMock = sinon.mock(passwordHelper);
    passwordHelperMock.expects('passwordStrongEnough').withArgs(sinon.match.any, 'password').returns(true);

    const emailMock = sinon.mock(emailValidator);
    emailMock.expects('validate').once().withArgs('username').returns(true);

    const instance = registerController(provider, accountService, clientHelper, passwordHelper, emailValidator);
    instance.handleRegistration({
        body : {
            login : 'username',
            password : 'password'
        }
    }, 'response');

    setTimeout(() => {
        providerMock.verify();
        clientMock.verify();
        accountMock.verify();
        clientHelperMock.verify();
        passwordHelperMock.verify();
        emailMock.verify();

        done();
    }, 1);
};

const handleRegistrationTest = (done) => {
        const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, 'response').returns(Promise.resolve({
        params : {
            client_id : 'my-client'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs(sinon.match.any, 'response', {
        select_account : {},
        login : {
            account : 1234
        },
    }, {
        mergeWithLastSubmission : false
    }).returns(Promise.resolve());

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({
        features : {
            registration : {
                enabled : true
            }
        }
    }));

    const accountMock = sinon.mock(accountService);
    accountMock.expects('registerUser').once().withArgs('username', 'password').returns(Promise.resolve({
        subject : 1234
    }));

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('registrationEnabled').once().returns(true);
    clientHelperMock.expects('getPasswordRules').once().returns({
        error : 'oh noes'
    });

    const passwordHelperMock = sinon.mock(passwordHelper);
    passwordHelperMock.expects('passwordStrongEnough').withArgs(sinon.match.any, 'password').returns(true);

    const emailMock = sinon.mock(emailValidator);
    emailMock.expects('validate').once().withArgs('username').returns(true);

    const instance = registerController(provider, accountService, clientHelper, passwordHelper, emailValidator);
    instance.handleRegistration({
        body : {
            login : 'username',
            password : 'password'
        }
    }, 'response');

    setTimeout(() => {
        providerMock.verify();
        clientMock.verify();
        accountMock.verify();
        clientHelperMock.verify();
        passwordHelperMock.verify();
        emailMock.verify();

        done();
    }, 1);
};

describe('A register controller', () => {
    describe('show registration form', () => {
        it('handles exceptions', showRegistrationFormExceptions);
        it('handles registration being disabled', showRegistrationFormDisabled);
        it('works', showRegistrationFormTest);
    });

    describe('handle registration', () => {
        it('handles exceptions', handleRegistrationExceptions);
        it('handles registration being disabled', handleRegistrationDisabled);
        it('handles missing username', handleRegistrationNoUsername);
        it('handles username not being an email', handleRegistrationNotEmail);
        it('handles weak passwords', handleRegistrationWeakPassword);
        it('handles banned passwords', handleRegistrationBannedPassword);
        it('handles errors creating the account', handleRegistrationDuplicates);
        it('works', handleRegistrationTest);
    });
});