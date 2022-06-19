const
    sinon                = require('sinon'),
    validationController = require('../../../../src/service.identity.idp/lib/controllers/validationController');

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
    validationRequired : () => {},
    validationMechanism : () => {},
    getTotpSettings : () => {},
    getFromEmailAddress : () => {},
};

const emailService = {
    sendEmail : () => {}
};

const totpGenerator = {
    verifyTotp : () => {},
    generateTotp : () => {},
};

const ejs = {
    renderFile : () => {}
};

const path = {
    join : () => {}
};

const hostnameResolver = {
    resolveIdentity: () => {}
};

const exceptionTest = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('req', 'res').returns(Promise.reject(new Error('oh dear')));

    const instance = validationController(provider, accountService, clientHelper, emailService, totpGenerator, ejs, path, hostnameResolver);

    instance.showValidationForm('req', 'res', (err) => {
        expect(err).toEqual(new Error('oh dear'));

        providerMock.verify();

        done();
    });
};

const noValidation = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('req', 'res').returns(Promise.resolve({
        session : {
            accountId : '1234'
        },
        params : {
            client_id : 'my-client'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs('req', 'res', {
        select_account : {},
        login : {
            account: 'acc-1234'
        }
    }, {
        mergeWithLastSubmission : false
    }).returns(Promise.resolve());

    const accountMock = sinon.mock(accountService);
    accountMock.expects('findAccount').once().withArgs(null, '1234').returns(Promise.resolve({
        accountId : 'acc-1234'
    }));

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve('the-client'));

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('validationRequired').once().withArgs(sinon.match.any, 'the-client').returns(false);

    const instance = validationController(provider, accountService, clientHelper, emailService, totpGenerator, ejs, path, hostnameResolver);

    instance.showValidationForm('req', 'res');

    setTimeout(() => {
        providerMock.verify();
        accountMock.verify();
        clientMock.verify();
        clientHelperMock.verify();

        done();
    }, 1);
};

const noValidationHandlesNullAccountId = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().withArgs('req', 'res').returns(Promise.resolve({
        session : {
            accountId : '1234'
        },
        params : {
            client_id : 'my-client'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs('req', 'res', {
        select_account : {},
        login : {
            account: null
        }
    }, {
        mergeWithLastSubmission : false
    }).returns(Promise.resolve());

    const accountMock = sinon.mock(accountService);
    accountMock.expects('findAccount').once().withArgs(null, '1234').returns(Promise.resolve('my-account'));

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve('the-client'));

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('validationRequired').once().withArgs('my-account', 'the-client').returns(false);

    const instance = validationController(provider, accountService, clientHelper, emailService, totpGenerator, ejs, path, hostnameResolver);

    instance.showValidationForm('req', 'res');

    setTimeout(() => {
        providerMock.verify();
        accountMock.verify();
        clientMock.verify();
        clientHelperMock.verify();

        done();
    }, 1);
};

const validateLinkToken = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().returns(Promise.resolve({
        session : {
            accountId : '1234'
        },
        params : {
            client_id : 'my-client'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs(sinon.match.any, sinon.match.any, {
        select_account : {},
        login : {
            account: 'acc-1234'
        }
    }, {
        mergeWithLastSubmission : false
    }).returns(Promise.resolve());

    const accountMock = sinon.mock(accountService);
    accountMock.expects('findAccount').once().withArgs(null, '1234').returns(Promise.resolve({
        accountId : 'acc-1234',
        profile : {
            subject : 'my-subject',
            claims : {}
        }
    }));
    accountMock.expects('updateUser').once().withArgs('acc-1234', sinon.match.any).returns(Promise.resolve());

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve('the-client'));

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('validationRequired').once().returns(true);
    clientHelperMock.expects('validationMechanism').once().returns('link-token');
    clientHelperMock.expects('getTotpSettings').once().returns('totp-settings');

    const totpMock = sinon.mock(totpGenerator);
    totpMock.expects('verifyTotp').once().withArgs('my-subject', 'my-code', 'totp-settings').returns(true);

    const instance = validationController(provider, accountService, clientHelper, emailService, totpGenerator, ejs, path, hostnameResolver);

    instance.showValidationForm({
        method : 'GET',
        query : {
            code : 'my-code'
        }
    }, 'res');

    setTimeout(() => {
        providerMock.verify();
        accountMock.verify();
        clientMock.verify();
        clientHelperMock.verify();
        totpMock.verify();

        done();
    }, 1);
};

const invalidLinkToken = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().returns(Promise.resolve({
        session : {
            accountId : '1234'
        },
        params : {
            client_id : 'my-client'
        },
        prompt : {

        }
    }));

    const accountMock = sinon.mock(accountService);
    accountMock.expects('findAccount').once().withArgs(null, '1234').returns(Promise.resolve({
        accountId : 'acc-1234',
        profile : {
            subject : 'my-subject',
            claims : {}
        }
    }));

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve('the-client'));

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('validationRequired').once().returns(true);
    clientHelperMock.expects('validationMechanism').once().returns('link-token');
    clientHelperMock.expects('getTotpSettings').once().returns('totp-settings');

    const totpMock = sinon.mock(totpGenerator);
    totpMock.expects('verifyTotp').once().withArgs('my-subject', 'my-code', 'totp-settings').returns(false);

    const instance = validationController(provider, accountService, clientHelper, emailService, totpGenerator, ejs, path, hostnameResolver);

    instance.showValidationForm({
        method : 'GET',
        query : {
            code : 'my-code'
        }
    }, {
        render : (template, data) => {
            expect(template).toEqual('validate');
            expect(data.validationError).toEqual('The validation link was not valid, please try again.');

            providerMock.verify();
            accountMock.verify();
            clientMock.verify();
            clientHelperMock.verify();
            totpMock.verify();

            done();
        }
    });
};

const sendLinkToken = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().returns(Promise.resolve({
        session : {
            accountId : '1234'
        },
        params : {
            client_id : 'my-client'
        },
        prompt : {

        },
        uid : 'my-uid'
    }));

    const accountMock = sinon.mock(accountService);
    accountMock.expects('findAccount').once().withArgs(null, '1234').returns(Promise.resolve({
        accountId : 'acc-1234',
        profile : {
            subject : 'my-subject',
            username : 'my-username',
            claims : {}
        }
    }));

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve('the-client'));

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('validationRequired').once().returns(true);
    clientHelperMock.expects('validationMechanism').once().returns('link-token');
    clientHelperMock.expects('getTotpSettings').once().returns('totp-settings');
    clientHelperMock.expects('getFromEmailAddress').once().returns('from@email.com');

    const totpMock = sinon.mock(totpGenerator);
    totpMock.expects('generateTotp').once().withArgs('my-subject', 'totp-settings').returns('my-code');

    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, '../../emails/validateLinkToken.ejs').returns('my-template');

    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveIdentity').once().returns('http://idp');

    const ejsMock = sinon.mock(ejs);
    ejsMock.expects('renderFile').once().withArgs('my-template', {
        code : 'my-code',
        idpHost : 'http://idp',
        uid : 'my-uid',
        username : 'my-username'
    }).returns(Promise.resolve('some-html'));

    const emailMock = sinon.mock(emailService);
    emailMock.expects('sendEmail').once().withArgs('from@email.com', 'my-username', 'Validate account', 'some-html').returns(Promise.resolve());

    const instance = validationController(provider, accountService, clientHelper, emailService, totpGenerator, ejs, path, hostnameResolver);

    instance.showValidationForm({
        method : 'POST',
        body : {
            send : 1
        }
    }, {
        render : (template, data) => {
            expect(template).toEqual('validate');
            expect(data.sent).toEqual(true);

            providerMock.verify();
            accountMock.verify();
            clientMock.verify();
            clientHelperMock.verify();
            totpMock.verify();
            pathMock.verify();
            hostnameMock.verify();
            ejsMock.verify();
            emailMock.verify();

            done();
        }
    });
};

const validateCode = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().returns(Promise.resolve({
        session : {
            accountId : '1234'
        },
        params : {
            client_id : 'my-client'
        }
    }));
    providerMock.expects('interactionFinished').once().withArgs(sinon.match.any, sinon.match.any, {
        select_account : {},
        login : {
            account: null
        }
    }, {
        mergeWithLastSubmission : false
    }).returns(Promise.resolve());

    const accountMock = sinon.mock(accountService);
    accountMock.expects('findAccount').once().withArgs(null, '1234').returns(Promise.resolve({
        accountId : null,
        profile : {
            subject : 'my-subject',
            claims : {}
        }
    }));
    accountMock.expects('updateUser').once().withArgs(null, sinon.match.any).returns(Promise.resolve());

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve('the-client'));

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('validationRequired').once().returns(true);
    clientHelperMock.expects('validationMechanism').once().returns('totp');
    clientHelperMock.expects('getTotpSettings').once().returns('totp-settings');

    const totpMock = sinon.mock(totpGenerator);
    totpMock.expects('verifyTotp').once().withArgs('my-subject', 'my-code', 'totp-settings').returns(true);

    const instance = validationController(provider, accountService, clientHelper, emailService, totpGenerator, ejs, path, hostnameResolver);

    instance.showValidationForm({
        method : 'POST',
        body : {
            validate : 1,
            code : 'my-code'
        }
    }, 'res');

    setTimeout(() => {
        providerMock.verify();
        accountMock.verify();
        clientMock.verify();
        clientHelperMock.verify();
        totpMock.verify();

        done();
    }, 1);
};

const invalidCode = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().returns(Promise.resolve({
        session : {
            accountId : '1234'
        },
        params : {
            client_id : 'my-client'
        },
        prompt : {

        }
    }));

    const accountMock = sinon.mock(accountService);
    accountMock.expects('findAccount').once().withArgs(null, '1234').returns(Promise.resolve({
        accountId : 'acc-1234',
        profile : {
            subject : 'my-subject',
            claims : {}
        }
    }));

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve('the-client'));

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('validationRequired').once().returns(true);
    clientHelperMock.expects('validationMechanism').once().returns('totp');
    clientHelperMock.expects('getTotpSettings').once().returns('totp-settings');

    const totpMock = sinon.mock(totpGenerator);
    totpMock.expects('verifyTotp').once().withArgs('my-subject', 'my-code', 'totp-settings').returns(false);

    const instance = validationController(provider, accountService, clientHelper, emailService, totpGenerator, ejs, path, hostnameResolver);

    instance.showValidationForm({
        method : 'POST',
        body : {
            validate : 1,
            code : 'my-code'
        }
    }, {
        render : (template, data) => {
            expect(template).toEqual('validate');
            expect(data.validationError).toEqual('That code is not valid, please try again.');

            providerMock.verify();
            accountMock.verify();
            clientMock.verify();
            clientHelperMock.verify();
            totpMock.verify();

            done();
        }
    });
};

const sendTotp = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionDetails').once().returns(Promise.resolve({
        session : {
            accountId : '1234'
        },
        params : {
            client_id : 'my-client'
        },
        prompt : {

        },
        uid : 'my-uid'
    }));

    const accountMock = sinon.mock(accountService);
    accountMock.expects('findAccount').once().withArgs(null, '1234').returns(Promise.resolve({
        accountId : 'acc-1234',
        profile : {
            subject : 'my-subject',
            username : 'my-username',
            claims : {}
        }
    }));

    const clientMock = sinon.mock(provider.Client);
    clientMock.expects('find').once().withArgs('my-client').returns(Promise.resolve('the-client'));

    const clientHelperMock = sinon.mock(clientHelper);
    clientHelperMock.expects('validationRequired').once().returns(true);
    clientHelperMock.expects('validationMechanism').once().returns('totp');
    clientHelperMock.expects('getTotpSettings').once().returns('totp-settings');
    clientHelperMock.expects('getFromEmailAddress').once().returns('from@email.com');

    const totpMock = sinon.mock(totpGenerator);
    totpMock.expects('generateTotp').once().withArgs('my-subject', 'totp-settings').returns('my-code');

    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, '../../emails/validateTotpCode.ejs').returns('my-template');

    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveIdentity').once().returns('http://idp');

    const ejsMock = sinon.mock(ejs);
    ejsMock.expects('renderFile').once().withArgs('my-template', {
        code : 'my-code',
        idpHost : 'http://idp',
        uid : 'my-uid',
        username : 'my-username'
    }).returns(Promise.resolve('some-html'));

    const emailMock = sinon.mock(emailService);
    emailMock.expects('sendEmail').once().withArgs('from@email.com', 'my-username', 'Validate account', 'some-html').returns(Promise.resolve());

    const instance = validationController(provider, accountService, clientHelper, emailService, totpGenerator, ejs, path, hostnameResolver);

    instance.showValidationForm({
        method : 'POST',
        body : {
            send : 1
        }
    }, {
        render : (template, data) => {
            expect(template).toEqual('validate');
            expect(data.sent).toEqual(true);

            providerMock.verify();
            accountMock.verify();
            clientMock.verify();
            clientHelperMock.verify();
            totpMock.verify();
            pathMock.verify();
            hostnameMock.verify();
            ejsMock.verify();
            emailMock.verify();

            done();
        }
    });
};

describe('A validation controller', () => {
    describe('showValidationForm', () => {
        it('handles exceptions', exceptionTest);
        it('redirects if validation is not required', noValidation);
        it('redirects if validation is not required, null account id', noValidationHandlesNullAccountId);
        it('validates link tokens', validateLinkToken);
        it('handles invalid link tokens', invalidLinkToken);
        it('sends link tokens', sendLinkToken);
        it('validates totp codes', validateCode);
        it('handles invalid totp codes', invalidCode);
        it('sends link tokens', sendTotp);
    });
});
