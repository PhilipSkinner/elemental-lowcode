const
    sinon              = require('sinon'),
    passwordController = require('../../../../src/service.identity.idp/lib/controllers/passwordController');

const provider = {
    interactionDetails : () => {},
    interactionFinished : () => {},
    Client : {
        find : () => {}
    }
};

const accountService = {
    findAccount : () => {},
    findByUsername : () => {},
    generatePassword : () => {},
    updateUser : () => {}
};

const clientHelper = {
    registrationEnabled : () => {},
    getPasswordRules : () => {},
    getBannedPasswords : () => {},
    resetEnabled : () => {},
    getTotpSettings : () => {},
    getFromEmailAddress : () => {}
};

const passwordHelper = {
    passwordStrongEnough : () => {},
    isBannedPassword : () => {}
};

const emailService = {
    sendEmail : () => {}
};

const totpGenerator = {
    generateTotp : () => {}
};

const ejs = {
    renderFile : () => {}
};

const path = {
    join : () => {}
};

const hostnameResolver = {
    resolveIdentity : () => {}
};

const showPasswordFormExceptions = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('request', 'response').returns(Promise.reject(new Error('oh noes')));

    const instance = passwordController(provider, accountService, clientHelper);
    instance.showPasswordForm('request', 'response', (err) => {
        expect(err).toEqual(new Error('oh noes'));

        providerMock.verify();

        done();
    });
};

const showPasswordFormTest = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('request', sinon.match.any).returns(Promise.resolve({
        params : {
            client_id : 'my-client'
        },
        uid : 'the-uid',
        prompt : {
            details : 'the-details'
        },
        session : {
            accountId : 1234
        }
    }));

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({
        features : {
            password : {
                error : 'oh noes'
            }
        }
    }));

    const instance = passwordController(provider, accountService);
    instance.showPasswordForm('request', {
        render : (template, data) => {
            expect(template).toEqual('password');
            expect(data).toEqual({
                client : {
                    features : {
                        password : {
                            error : 'oh noes'
                        }
                    }
                },
                uid : 'the-uid',
                details : 'the-details',
                params : {
                    client_id : 'my-client'
                },
                passwordError : 'oh noes',
                title : 'Reset Password'
            })

            providerMock.verify();
            clientMock.verify();

            done();
        }
    }, (err) => {
        console.log(err);
    });
};

const showPasswordNotAuthenticated = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('request', sinon.match.any).returns(Promise.resolve({
        params : {
            client_id : 'my-client'
        },
        uid : 'the-uid',
        prompt : {
            details : 'the-details'
        },
        lastSubmission : {
            email_sent : true,
            validation_code : '1234'
        }
    }));

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve({
        features : {
            password : {
                error : 'oh noes'
            }
        }
    }));

    const instance = passwordController(provider, accountService);
    instance.showPasswordForm('request', {
        render : (template, data) => {
            expect(template).toEqual('forgottenPassword');
            expect(data).toEqual({
                client : {
                    features : {
                        password : {
                            error : 'oh noes'
                        }
                    }
                },
                uid : 'the-uid',
                details : 'the-details',
                params : {
                    client_id : 'my-client'
                },
                title : 'Confirm email address',
                sent : true,
                code : '1234'
            })

            providerMock.verify();
            clientMock.verify();

            done();
        }
    }, (err) => {
        console.log(err);
    });
};

const handlePasswordExceptions = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('request', 'response').returns(Promise.reject(new Error('oh noes')));

    const instance = passwordController(provider, accountService);
    instance.handlePassword('request', 'response', (err) => {
        expect(err).toEqual(new Error('oh noes'));

        providerMock.verify();

        done();
    });
};

const handlePasswordWeakPassword = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, 'response').returns(Promise.resolve({
        params : {
            client_id : 'my-client'
        },
        session : {
            accountId : 1234
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs(sinon.match.any, 'response', {
        select_account : {},
        prompt : 'password',
        password_error : 'oh noes',
        login : {
            account : 1234
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
    accountMock.expects('findAccount').once().withArgs(null, 1234).returns('the-account');

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('getPasswordRules').once().returns({
        error : 'oh noes'
    });

    const passwordHelperMock = sinon.mock(passwordHelper);
    passwordHelperMock.expects('passwordStrongEnough').withArgs(sinon.match.any, 'password').returns(false);

    const instance = passwordController(provider, accountService, clientHelper, passwordHelper);
    instance.handlePassword({
        body : {
            password : 'password'
        }
    }, 'response');

    setTimeout(() => {
        providerMock.verify();
        clientMock.verify();
        accountMock.verify();
        clientHelperMock.verify();
        passwordHelperMock.verify();

        done();
    }, 1);
};

const handlePasswordBannedPassword = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, 'response').returns(Promise.resolve({
        params : {
            client_id : 'my-client'
        },
        session : {
            accountId : 1234
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs(sinon.match.any, 'response', {
        select_account : {},
        prompt : 'password',
        password_error : 'That password is not allowed - it has been banned.',
        login : {
            account : 1234
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
    accountMock.expects('findAccount').once().withArgs(null, 1234).returns('the-account');

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('getPasswordRules').once().returns({
        error : 'oh noes'
    });
    clientHelperMock.expects('getBannedPasswords').once().returns('banned-passwords');

    const passwordHelperMock = sinon.mock(passwordHelper);
    passwordHelperMock.expects('passwordStrongEnough').withArgs(sinon.match.any, 'password').returns(true);
    passwordHelperMock.expects('isBannedPassword').once().withArgs('banned-passwords', 'password').returns(true);

    const instance = passwordController(provider, accountService, clientHelper, passwordHelper);
    instance.handlePassword({
        body : {
            password : 'password'
        }
    }, 'response');

    setTimeout(() => {
        providerMock.verify();
        clientMock.verify();
        accountMock.verify();
        clientHelperMock.verify();
        passwordHelperMock.verify();

        done();
    }, 1);
};

const handlePasswordMismatched = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, 'response').returns(Promise.resolve({
        params : {
            client_id : 'my-client'
        },
        session : {
            accountId : 1234
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs(sinon.match.any, 'response', {
        select_account : {},
        prompt : 'password',
        password_error : 'Your passwords did not match.',
        login : {
            account : 1234
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
    accountMock.expects('findAccount').once().withArgs(null, 1234).returns('the-account');

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('getPasswordRules').once().returns({
        error : 'oh noes'
    });

    const passwordHelperMock = sinon.mock(passwordHelper);
    passwordHelperMock.expects('passwordStrongEnough').withArgs(sinon.match.any, 'password').returns(true);

    const instance = passwordController(provider, accountService, clientHelper, passwordHelper);
    instance.handlePassword({
        body : {
            password : 'password',
            repeat : 'different'
        }
    }, 'response');

    setTimeout(() => {
        providerMock.verify();
        clientMock.verify();
        accountMock.verify();
        clientHelperMock.verify();
        passwordHelperMock.verify();

        done();
    }, 1);
};

const handlePasswordTest = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, 'response').returns(Promise.resolve({
        params : {
            client_id : 'my-client'
        },
        session : {
            accountId : 1234
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs(sinon.match.any, 'response', {
        select_account : {},
        login : {
            account : 1234
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
    accountMock.expects('findAccount').once().withArgs(null, 1234).returns(Promise.resolve({
        accountId : 1234,
        profile : {
            password : 'original'
        }
    }));
    accountMock.expects('generatePassword').once().withArgs('password').returns(Promise.resolve('hashed-password'));
    accountMock.expects('updateUser').once().withArgs(1234, {
        password : 'hashed-password'
    }).returns(Promise.resolve());

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('getPasswordRules').once().returns({
        error : 'oh noes'
    });

    const passwordHelperMock = sinon.mock(passwordHelper);
    passwordHelperMock.expects('passwordStrongEnough').withArgs(sinon.match.any, 'password').returns(true);

    const instance = passwordController(provider, accountService, clientHelper, passwordHelper);
    instance.handlePassword({
        body : {
            password : 'password',
            repeat : 'password'
        }
    }, 'response');

    setTimeout(() => {
        providerMock.verify();
        clientMock.verify();
        accountMock.verify();
        clientHelperMock.verify();
        passwordHelperMock.verify();

        done();
    }, 1);
};

const showForgottenFormExceptions = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('req', 'res').returns(Promise.reject(new Error('oh dear')));

    const instance = passwordController(provider, accountService, clientHelper, passwordHelper, emailService, totpGenerator, ejs, path, hostnameResolver);

    instance.showForgottenPasswordForm('req', 'res', (err) => {
        expect(err).toEqual(new Error('oh dear'));

        providerMock.verify();

        done();
    });
};

const showForgottenFormNotEnabled = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('req', 'res').returns(Promise.resolve({
        params : {
            client_id : 'client-id'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs('req', 'res', {
        prompt : 'login'
    }, {
        mergeWithLastSubmission : false
    }).returns(Promise.resolve());

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('resetEnabled').once().returns(false);

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('client-id').returns(Promise.resolve({}));

    const instance = passwordController(provider, accountService, clientHelper, passwordHelper, emailService, totpGenerator, ejs, path, hostnameResolver);

    instance.showForgottenPasswordForm('req', 'res');

    setTimeout(() => {
        providerMock.verify();
        clientMock.verify();
        clientHelperMock.verify();

        done();
    });
};

const showForgottenForm = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('req', sinon.match.any).returns(Promise.resolve({
        params : {
            client_id : 'client-id'
        },
        prompt : {

        }
    }));

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('resetEnabled').once().returns(true);

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('client-id').returns(Promise.resolve({}));

    const instance = passwordController(provider, accountService, clientHelper, passwordHelper, emailService, totpGenerator, ejs, path, hostnameResolver);

    instance.showForgottenPasswordForm('req', {
        render : (template, data) => {
            providerMock.verify();
            clientMock.verify();
            clientHelperMock.verify();

            done();
        }
    }, (err) => {
        console.log(err);
    });
};

const sendVerificationEmailExceptions = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('req', 'res').returns(Promise.reject(new Error('oh dear')));

    const instance = passwordController(provider, accountService, clientHelper, passwordHelper, emailService, totpGenerator, ejs, path, hostnameResolver);

    instance.sendVerificationEmail('req', 'res', (err) => {
        expect(err).toEqual(new Error('oh dear'));

        providerMock.verify();

        done();
    });
};

const sendVerificationEmailNotEnabled = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('req', 'res').returns(Promise.resolve({
        params : {
            client_id : 'client-id'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs('req', 'res', {
        prompt : 'login'
    }, {
        mergeWithLastSubmission : false
    }).returns(Promise.resolve());

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('resetEnabled').once().returns(false);

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('client-id').returns(Promise.resolve({}));

    const instance = passwordController(provider, accountService, clientHelper, passwordHelper, emailService, totpGenerator, ejs, path, hostnameResolver);

    instance.sendVerificationEmail('req', 'res');

    setTimeout(() => {
        providerMock.verify();
        clientMock.verify();
        clientHelperMock.verify();

        done();
    });
};

const sendVerificationEmailNoSuchAccount = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs({
        body : {
            username : 'my-username'
        }
    }, 'res').returns(Promise.resolve({
        params : {
            client_id : 'client-id'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs({
        body : {
            username : 'my-username'
        }
    }, 'res', {
        prompt          : 'code',
        email_sent      : true,
        validation_code : null,
        username        : null,
        subject         : null
    }, {
        mergeWithLastSubmission : true
    }).returns(Promise.resolve());

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('resetEnabled').once().returns(true);

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('client-id').returns(Promise.resolve({}));

    const accountMock = sinon.mock(accountService);
    accountMock.expects('findByUsername').once().withArgs('my-username').returns(Promise.resolve(null));

    const instance = passwordController(provider, accountService, clientHelper, passwordHelper, emailService, totpGenerator, ejs, path, hostnameResolver);

    instance.sendVerificationEmail({
        body : {
            username : 'my-username'
        }
    }, 'res');

    setTimeout(() => {
        providerMock.verify();
        clientMock.verify();
        clientHelperMock.verify();
        accountMock.verify();

        done();
    });
};

const sendVerificationEmailLinkToken = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs({
        body : {
            username : 'my-username'
        }
    }, 'res').returns(Promise.resolve({
        params : {
            client_id : 'client-id'
        },
        uid : 'my-uid',
    }));
    providerMock.expects('interactionFinished').once().withArgs({
        body : {
            username : 'my-username'
        }
    }, 'res', {
        prompt          : 'code',
        email_sent      : true,
        validation_code : 'my-totp',
        username        : 'my-username',
        subject         : '1234'
    }, {
        mergeWithLastSubmission : true
    }).returns(Promise.resolve());

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('resetEnabled').once().returns(true);
    clientHelperMock.expects('getTotpSettings').once().returns('totp-settings');
    clientHelperMock.expects('getFromEmailAddress').once().returns('my@email.com');

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('client-id').returns(Promise.resolve({
        features : {
            reset : {
                mechanism : 'link-token'
            }
        }
    }));

    const accountMock = sinon.mock(accountService);
    accountMock.expects('findByUsername').once().withArgs('my-username').returns(Promise.resolve({
        profile : {
            subject : '1234',
            username : 'my-username'
        }
    }));

    const totpMock = sinon.mock(totpGenerator);
    totpMock.expects('generateTotp').once().withArgs('1234', 'totp-settings').returns('my-totp');

    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveIdentity').once().returns('https://my.idp');

    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, '../../emails/forgottenLinkToken.ejs').returns('link-token');

    const ejsMock = sinon.mock(ejs);
    ejsMock.expects('renderFile').once().withArgs('link-token', {
        code        : 'my-totp',
        idpHost     : 'https://my.idp',
        uid         : 'my-uid',
        username    : 'my-username'
    }).returns(Promise.resolve('some-html'));

    const emailMock = sinon.mock(emailService);
    emailMock.expects('sendEmail').once().withArgs('my@email.com', 'my-username', 'Reset password', 'some-html').returns(Promise.resolve());

    const instance = passwordController(provider, accountService, clientHelper, passwordHelper, emailService, totpGenerator, ejs, path, hostnameResolver);

    instance.sendVerificationEmail({
        body : {
            username : 'my-username'
        }
    }, 'res');

    setTimeout(() => {
        providerMock.verify();
        clientMock.verify();
        clientHelperMock.verify();
        accountMock.verify();
        totpMock.verify();
        hostnameMock.verify();
        pathMock.verify();
        ejsMock.verify();
        emailMock.verify();

        done();
    });
};

const sendVerificationEmailTotpCode = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs({
        body : {
            username : 'my-username'
        }
    }, 'res').returns(Promise.resolve({
        params : {
            client_id : 'client-id'
        },
        uid : 'my-uid',
    }));
    providerMock.expects('interactionFinished').once().withArgs({
        body : {
            username : 'my-username'
        }
    }, 'res', {
        prompt          : 'code',
        email_sent      : true,
        validation_code : 'my-totp',
        username        : 'my-username',
        subject         : '1234'
    }, {
        mergeWithLastSubmission : true
    }).returns(Promise.resolve());

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('resetEnabled').once().returns(true);
    clientHelperMock.expects('getTotpSettings').once().returns('totp-settings');
    clientHelperMock.expects('getFromEmailAddress').once().returns('my@email.com');

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('client-id').returns(Promise.resolve({
        features : {
            reset : {
                mechanism : 'totp'
            }
        }
    }));

    const accountMock = sinon.mock(accountService);
    accountMock.expects('findByUsername').once().withArgs('my-username').returns(Promise.resolve({
        profile : {
            subject : '1234',
            username : 'my-username'
        }
    }));

    const totpMock = sinon.mock(totpGenerator);
    totpMock.expects('generateTotp').once().withArgs('1234', 'totp-settings').returns('my-totp');

    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveIdentity').once().returns('https://my.idp');

    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, '../../emails/forgottenTotpCode.ejs').returns('totp-code');

    const ejsMock = sinon.mock(ejs);
    ejsMock.expects('renderFile').once().withArgs('totp-code', {
        code        : 'my-totp',
        idpHost     : 'https://my.idp',
        uid         : 'my-uid',
        username    : 'my-username'
    }).returns(Promise.resolve('some-html'));

    const emailMock = sinon.mock(emailService);
    emailMock.expects('sendEmail').once().withArgs('my@email.com', 'my-username', 'Reset password', 'some-html').returns(Promise.resolve());

    const instance = passwordController(provider, accountService, clientHelper, passwordHelper, emailService, totpGenerator, ejs, path, hostnameResolver);

    instance.sendVerificationEmail({
        body : {
            username : 'my-username'
        }
    }, 'res');

    setTimeout(() => {
        providerMock.verify();
        clientMock.verify();
        clientHelperMock.verify();
        accountMock.verify();
        totpMock.verify();
        hostnameMock.verify();
        pathMock.verify();
        ejsMock.verify();
        emailMock.verify();

        done();
    });
};

const handleResetCodeExceptions = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('req', 'res').returns(Promise.reject(new Error('oh dear')));

    const instance = passwordController(provider, accountService, clientHelper, passwordHelper, emailService, totpGenerator, ejs, path, hostnameResolver);

    instance.handleResetCode('req', 'res', (err) => {
        expect(err).toEqual(new Error('oh dear'));

        providerMock.verify();

        done();
    });
};

const handleResetCodeNotEnabled = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('req', 'res').returns(Promise.resolve({
        params : {
            client_id : 'client-id'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs('req', 'res', {
        prompt : 'login'
    }, {
        mergeWithLastSubmission : false
    }).returns(Promise.resolve());

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('resetEnabled').once().returns(false);

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('client-id').returns(Promise.resolve({}));

    const instance = passwordController(provider, accountService, clientHelper, passwordHelper, emailService, totpGenerator, ejs, path, hostnameResolver);

    instance.handleResetCode('req', 'res');

    setTimeout(() => {
        providerMock.verify();
        clientMock.verify();
        clientHelperMock.verify();

        done();
    });
};

const handleResetCodeInvalidSubmission = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('req', 'res').returns(Promise.resolve({
        params : {
            client_id : 'client-id'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs('req', 'res', {
        prompt : 'login'
    }, {
        mergeWithLastSubmission : false
    }).returns(Promise.resolve());

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('resetEnabled').once().returns(true);

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('client-id').returns(Promise.resolve({}));

    const instance = passwordController(provider, accountService, clientHelper, passwordHelper, emailService, totpGenerator, ejs, path, hostnameResolver);

    instance.handleResetCode('req', 'res');

    setTimeout(() => {
        providerMock.verify();
        clientMock.verify();
        clientHelperMock.verify();

        done();
    });
};

const handleResetCodeRendersForm = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, sinon.match.any).returns(Promise.resolve({
        params : {
            client_id : 'client-id'
        },
        lastSubmission : {
            email_sent : true
        },
        uid : 'my-uid',
    }));

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('resetEnabled').once().returns(true);

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('client-id').returns(Promise.resolve('my-client'));

    const instance = passwordController(provider, accountService, clientHelper, passwordHelper, emailService, totpGenerator, ejs, path, hostnameResolver);

    instance.handleResetCode({
        query : {},
        body : {}
    }, {
        render : (template, data) => {
            expect(template).toEqual('resetCode');
            expect(data).toEqual({
                client      : 'my-client',
                uid         : 'my-uid',
                details     : {
                    email_sent : true
                },
                params      : {
                    client_id : 'client-id'
                },
                title       : 'Confirmation code',
                sent        : true,
                codeError   : null
            })

            providerMock.verify();
            clientMock.verify();
            clientHelperMock.verify();

            done();
        }
    });
};

const handleResetCodeInvalidCode = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, sinon.match.any).returns(Promise.resolve({
        params : {
            client_id : 'client-id'
        },
        lastSubmission : {
            email_sent : true,
            validation_code : '1234'
        },
        uid : 'my-uid',
    }));

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('resetEnabled').once().returns(true);

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('client-id').returns(Promise.resolve('my-client'));

    const instance = passwordController(provider, accountService, clientHelper, passwordHelper, emailService, totpGenerator, ejs, path, hostnameResolver);

    instance.handleResetCode({
        query : {
            code : '2345'
        },
        body : {}
    }, {
        render : (template, data) => {
            expect(template).toEqual('resetCode');
            expect(data).toEqual({
                client      : 'my-client',
                uid         : 'my-uid',
                details     : {
                    email_sent : true,
                    validation_code : '1234'
                },
                params      : {
                    client_id : 'client-id'
                },
                title       : 'Confirmation code',
                sent        : true,
                codeError   : 'That code is incorrect, please try again.'
            })

            providerMock.verify();
            clientMock.verify();
            clientHelperMock.verify();

            done();
        }
    });
};

const handleResetCodeValidCode = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs(sinon.match.any, sinon.match.any).returns(Promise.resolve({
        params : {
            client_id : 'client-id'
        },
        lastSubmission : {
            email_sent : true,
            validation_code : '1234'
        },
        uid : 'my-uid',
    }));

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('resetEnabled').once().returns(true);

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('client-id').returns(Promise.resolve('my-client'));

    const instance = passwordController(provider, accountService, clientHelper, passwordHelper, emailService, totpGenerator, ejs, path, hostnameResolver);

    instance.handleResetCode({
        query : {
            code : '1234'
        },
        body : {}
    }, {
        render : (template, data) => {
            expect(template).toEqual('resetPassword');
            expect(data).toEqual({
                client          : 'my-client',
                uid             : 'my-uid',
                details         : {
                    email_sent : true,
                    validation_code : '1234'
                },
                params          : {
                    client_id : 'client-id'
                },
                passwordError   : null,
                title           : 'Reset password',
            })

            providerMock.verify();
            clientMock.verify();
            clientHelperMock.verify();

            done();
        }
    });
};

describe('A password controller', () => {
    describe('show password form', () => {
        it('handles exceptions', showPasswordFormExceptions);
        it('works', showPasswordFormTest);
        it('renders forgotten password for none authenticated users', showPasswordNotAuthenticated);
    });

    describe('handle password', () => {
        it('handles exceptions', handlePasswordExceptions);
        it('handles weak passwords', handlePasswordWeakPassword);
        it('handles banned passwords', handlePasswordBannedPassword);
        it('handles mismatched passwords', handlePasswordMismatched);
        it('works', handlePasswordTest);
    });

    describe('show forgotten password form', () => {
        it('handles exceptions', showForgottenFormExceptions);
        it('handles reset not being enabled', showForgottenFormNotEnabled);
        it('works', showForgottenForm);
    });

    describe('sent verification email', () => {
        it('handles exceptions', sendVerificationEmailExceptions);
        it('handles reset not being enabled', sendVerificationEmailNotEnabled);
        it('handles no such account', sendVerificationEmailNoSuchAccount);
        it('handles link tokens', sendVerificationEmailLinkToken);
        it('handles totp codes', sendVerificationEmailTotpCode);
    });

    describe('handle reset code', () => {
        it('handles exceptions', handleResetCodeExceptions);
        it('with reset not being enabled', handleResetCodeNotEnabled);
        it('handles invalid last submissions', handleResetCodeInvalidSubmission);
        it('renders the form', handleResetCodeRendersForm);
        it('handles invalid codes', handleResetCodeInvalidCode);
        it('handles valid codes', handleResetCodeValidCode);
    });
});