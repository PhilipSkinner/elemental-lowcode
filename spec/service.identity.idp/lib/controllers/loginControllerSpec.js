const
    sinon             = require('sinon'),
    loginController   = require('../../../../src/service.identity.idp/lib/controllers/loginController');

const provider = {
    interactionDetails : () => {},
    interactionFinished : () => {},
    Client : {
        find : () => {}
    }
};

const accountService = {
    findByLogin : () => {}
};

const clientHelper = {
    termsOrPrivacyRequired      : () => {},
    getPasswordRules            : () => {},
    getBannedPasswords          : () => {},
    loginNotificationEnabled    : () => {},
    getFromEmailAddress         : () => {},
};

const passwordHelper = {
    passwordStrongEnough : () => {},
    isBannedPassword : () => {}
};

const ejs = {
    renderFile : () => {}
};

const path = {
    join : () => {}
};

const emailService = {
    sendEmail : () => {}
};

const showLoginFormExceptions = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('request', 'response').returns(Promise.reject(new Error('not today')));

    const instance = loginController(provider, accountService, clientHelper);

    instance.showLoginForm('request', 'response', (err) => {
        expect(err).toEqual(new Error('not today'));

        providerMock.verify();

        done();
    });
};

const showLoginFormInvalidPage = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, sinon.match.any).returns(Promise.resolve({
        prompt : {
            name : 'login'
        },
        lastSubmission : {
            prompt : 'not-login'
        }
    }));

    const instance = loginController(provider, accountService);

    instance.showLoginForm({
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

const showLoginForm = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, sinon.match.any).returns(Promise.resolve({
        prompt : {
            name : 'login',
            details : 'the-details',
        },
        uid : 'the-uid',
        params : {
            client_id : 'client-id'
        }
    }));

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('client-id').returns(Promise.resolve({
        features : {
            registration : {
                enabled : true
            }
        }
    }));

    const instance = loginController(provider, accountService);

    instance.showLoginForm({
        params : {
            uid : 'the-uid'
        }
    }, {
        render : (template, data) => {
            expect(template).toEqual('login');
            expect(data).toEqual({
                authError : false,
                client : {
                    features : {
                        registration : {
                            enabled : true
                        }
                    }
                },
                uid : 'the-uid',
                details : 'the-details',
                params : {
                    client_id : 'client-id'
                },
                newAccount : undefined,
                title : 'Sign-in',
                registrationEnabled : true,
                usernameError : false,
                passwordError : false,
                resetEnabled : undefined
            });

            providerMock.verify();
            clientMock.verify();

            done();
        }
    });
};

const showLoginFormAuthErrors = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, sinon.match.any).returns(Promise.resolve({
        prompt : {
            name : 'login',
            details : 'the-details',
        },
        lastSubmission : {
            prompt : 'login',
            login : {
                account : null
            },
            username_error : true,
            password_error : true
        },
        uid : 'the-uid',
        params : {
            client_id : 'client-id'
        }
    }));

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('client-id').returns(Promise.resolve({
        features : {
            registration : {
                enabled : true
            }
        }
    }));

    const instance = loginController(provider, accountService);

    instance.showLoginForm({
        params : {
            uid : 'the-uid'
        }
    }, {
        render : (template, data) => {
            expect(template).toEqual('login');
            expect(data).toEqual({
                authError : true,
                client : {
                    features : {
                        registration : {
                            enabled : true
                        }
                    }
                },
                uid : 'the-uid',
                details : 'the-details',
                params : {
                    client_id : 'client-id'
                },
                newAccount : undefined,
                title : 'Sign-in',
                registrationEnabled : true,
                passwordError : true,
                usernameError : true,
                resetEnabled : undefined
            });

            providerMock.verify();
            clientMock.verify();

            done();
        }
    });
};

const handleLoginExceptions = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, 'response').returns(Promise.reject(new Error('not today')));

    const instance = loginController(provider, accountService);

    instance.handleLogin({
        body : {
            login : 'username',
            password : 'password'
        }
    }, 'response', (err) => {
        expect(err).toEqual(new Error('not today'));

        providerMock.verify();

        done();
    });
};

const handleLoginTerms = (done) => {
    const accountMock = sinon.mock(accountService);
    accountMock.expects('findByLogin').once().withArgs('username', 'password').returns(Promise.resolve({
        accountId : 1234,
        profile : {
            claims : {
                terms : '1'
            }
        }
    }));

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({
        features : {
            terms : {
                required : true,
                version : '2',
                issue_to : 'terms'
            }
        }
    }));

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
        prompt : 'terms'
    }, {
        mergeWithLastSubmission : false
    });

    const instance = loginController(provider, accountService);

    instance.handleLogin({
        body : {
            login : 'username',
            password : 'password'
        }
    }, 'response');

    setTimeout(() => {
        clientMock.verify();
        accountMock.verify();
        providerMock.verify();

        done();
    }, 1);
};

const handleLoginWeakPassword = (done) => {
    const accountMock = sinon.mock(accountService);
    accountMock.expects('findByLogin').once().withArgs('username', 'password').returns(Promise.resolve({
        accountId : 1234
    }));

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({}));

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
        prompt : 'password',
        password_error : null
    }, {
        mergeWithLastSubmission : false
    });

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('termsOrPrivacyRequired').once().returns(false);
    clientHelperMock.expects('getPasswordRules').once().returns('password-rules');
    clientHelperMock.expects('getBannedPasswords').once().returns('banned-passwords');

    const passwordHelperMock = sinon.mock(passwordHelper);
    passwordHelperMock.expects('passwordStrongEnough').once().withArgs('password-rules', 'password').returns(false);
    passwordHelperMock.expects('isBannedPassword').once().withArgs('banned-passwords', 'password').returns(false);

    const instance = loginController(provider, accountService, clientHelper, passwordHelper);

    instance.handleLogin({
        body : {
            login : 'username',
            password : 'password'
        }
    }, 'response');

    setTimeout(() => {
        clientMock.verify();
        accountMock.verify();
        providerMock.verify();
        clientHelperMock.verify();
        passwordHelperMock.verify();

        done();
    }, 1);
};

const handleLoginBannedPassword = (done) => {
    const accountMock = sinon.mock(accountService);
    accountMock.expects('findByLogin').once().withArgs('username', 'password').returns(Promise.resolve({
        accountId : 1234
    }));

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({}));

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
        prompt : 'password',
        password_error : 'That password is not allowed - it has been banned.'
    }, {
        mergeWithLastSubmission : false
    });

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('termsOrPrivacyRequired').once().returns(false);
    clientHelperMock.expects('getPasswordRules').once().returns('password-rules');
    clientHelperMock.expects('getBannedPasswords').once().returns('banned-passwords');

    const passwordHelperMock = sinon.mock(passwordHelper);
    passwordHelperMock.expects('passwordStrongEnough').once().withArgs('password-rules', 'password').returns(true);
    passwordHelperMock.expects('isBannedPassword').once().withArgs('banned-passwords', 'password').returns(true);

    const instance = loginController(provider, accountService, clientHelper, passwordHelper);

    instance.handleLogin({
        body : {
            login : 'username',
            password : 'password'
        }
    }, 'response');

    setTimeout(() => {
        clientMock.verify();
        accountMock.verify();
        providerMock.verify();
        clientHelperMock.verify();
        passwordHelperMock.verify();

        done();
    }, 1);
};

const handleLoginTest = (done) => {
    const accountMock = sinon.mock(accountService);
    accountMock.expects('findByLogin').once().withArgs('username', 'password').returns(Promise.resolve({
        accountId : 1234
    }));

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({}));

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
        username_error : false,
        password_error : false,
    }, {
        mergeWithLastSubmission : false
    }).returns(Promise.resolve());

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('termsOrPrivacyRequired').once().returns(false);
    clientHelperMock.expects('getPasswordRules').once().returns('password-rules');
    clientHelperMock.expects('loginNotificationEnabled').once().returns(false);

    const passwordHelperMock = sinon.mock(passwordHelper);
    passwordHelperMock.expects('passwordStrongEnough').once().withArgs('password-rules', 'password').returns(true);

    const instance = loginController(provider, accountService, clientHelper, passwordHelper);

    instance.handleLogin({
        body : {
            login : 'username',
            password : 'password'
        }
    }, 'response');

    setTimeout(() => {
        clientMock.verify();
        accountMock.verify();
        providerMock.verify();
        clientHelperMock.verify();
        passwordHelperMock.verify();

        done();
    }, 1);
};

const handleLoginFailedTest = (done) => {
    const accountMock = sinon.mock(accountService);
    accountMock.expects('findByLogin').once().withArgs('username', 'password').returns(Promise.resolve(null));

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({}));

    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, 'response').returns(Promise.resolve({
        params : {
            client_id : 'my-client'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs(sinon.match.any, 'response', {
        select_account : {},
        login : {
            account : null
        },
        username_error : false,
        password_error : false,
    }, {
        mergeWithLastSubmission : false
    }).returns(Promise.resolve());

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('loginNotificationEnabled').once().returns(true);

    const passwordHelperMock = sinon.mock(passwordHelper);

    const instance = loginController(provider, accountService, clientHelper, passwordHelper);

    instance.handleLogin({
        body : {
            login : 'username',
            password : 'password'
        }
    }, 'response');

    setTimeout(() => {
        clientMock.verify();
        accountMock.verify();
        providerMock.verify();
        clientHelperMock.verify();
        passwordHelperMock.verify();

        done();
    }, 1);
};

const handleLoginNotificationTest = (done) => {
    const accountMock = sinon.mock(accountService);
    accountMock.expects('findByLogin').once().withArgs('username', 'password').returns(Promise.resolve({
        accountId : 1234,
        profile : {
            username : 'my-username'
        }
    }));

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({}));

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
        username_error : false,
        password_error : false,
    }, {
        mergeWithLastSubmission : false
    }).returns(Promise.resolve());

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('termsOrPrivacyRequired').once().returns(false);
    clientHelperMock.expects('getPasswordRules').once().returns('password-rules');
    clientHelperMock.expects('loginNotificationEnabled').once().returns(true);
    clientHelperMock.expects('getFromEmailAddress').once().returns('my@email.com');

    const passwordHelperMock = sinon.mock(passwordHelper);
    passwordHelperMock.expects('passwordStrongEnough').once().withArgs('password-rules', 'password').returns(true);

    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, '../../emails/loginDetected.ejs').returns('my-template');

    const ejsMock = sinon.mock(ejs);
    ejsMock.expects('renderFile').once().withArgs('my-template', {
        username : 'my-username'
    }).returns(Promise.resolve('some-html'));

    const emailMock = sinon.mock(emailService);
    emailMock.expects('sendEmail').once().withArgs(
        'my@email.com',
        'my-username',
        'New login detected',
        'some-html'
    ).returns(Promise.resolve());

    const instance = loginController(provider, accountService, clientHelper, passwordHelper, emailService, ejs, path);

    instance.handleLogin({
        body : {
            login : 'username',
            password : 'password'
        }
    }, 'response');

    setTimeout(() => {
        clientMock.verify();
        accountMock.verify();
        providerMock.verify();
        clientHelperMock.verify();
        passwordHelperMock.verify();
        pathMock.verify();
        ejsMock.verify();
        emailMock.verify();

        done();
    }, 1);
};

describe('A login controller', () => {
    describe('show login form', () => {
        it('handles exceptions', showLoginFormExceptions);
        it('handles invalid pages', showLoginFormInvalidPage);
        it('renders the form', showLoginForm);
        it('renders auth errors', showLoginFormAuthErrors);
    });

    describe('handle login', () => {
        it('handles exceptions', handleLoginExceptions);
        it('handles terms being required', handleLoginTerms);
        it('handles password being too weak', handleLoginWeakPassword);
        it('handles password being banned', handleLoginBannedPassword);
        it('works', handleLoginTest);
        it('handles failed logins', handleLoginFailedTest);
        it('notifies on successful login', handleLoginNotificationTest);
    });
});