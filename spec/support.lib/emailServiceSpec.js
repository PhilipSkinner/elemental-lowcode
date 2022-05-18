const
    jasmine       = require('jasmine'),
    sinon         = require('sinon'),
    emailService  = require('../../src/support.lib/emailService');

const nodemailer = {
    createTransport : () => {},
    verify : () => {},
    sendMail : () => {}
};

const constructorTest = () => {
    const instance = emailService({});

    expect(instance.nodemailer).not.toBe(undefined);
};

const sendEmailExceptionTest = (done) => {
    const mailerMock = sinon.mock(nodemailer);
    mailerMock.expects('createTransport').once().withArgs({
        pool : true,
        host : 'my-host',
        port : 'my-port',
        secure : false,
        auth : {
            user : 'my-username',
            pass : 'my-password'
        },
        tls: {
            rejectUnauthorized: false,
        },
    }).returns(nodemailer);
    mailerMock.expects('verify').once().callsArgWith(0, null);
    mailerMock.expects('sendMail').once().withArgs({
        from : 'from',
        to : 'to',
        subject : 'subject',
        html : 'html',
        attachments : 'attachments'
    }).callsArgWith(1, new Error('oh noes'));

    var instance = emailService({
        host        : 'my-host',
        port        : 'my-port',
        username    : 'my-username',
        password    : 'my-password',
        protocol    : 'smtp'
    }, nodemailer);

    instance.sendEmail('from', 'to', 'subject', 'html', 'attachments').catch((err) => {
        expect(err).toEqual(new Error('oh noes'));

        mailerMock.verify();

        done();
    });
};

const sendEmailTest = (done) => {
    const mailerMock = sinon.mock(nodemailer);
    mailerMock.expects('createTransport').once().withArgs({
        pool : true,
        host : 'my-host',
        port : 587,
        secure : true,
        auth : {
            user : 'my-username',
            pass : 'my-password'
        },
        tls: {
            rejectUnauthorized: false,
        },
    }).returns(nodemailer);
    mailerMock.expects('verify').once().callsArgWith(0, new Error('oh dear'));
    mailerMock.expects('sendMail').once().withArgs({
        from : 'from',
        to : 'to',
        subject : 'subject',
        html : 'html',
        attachments : 'attachments'
    }).callsArgWith(1, null);

    var instance = emailService({
        host        : 'my-host',
        username    : 'my-username',
        password    : 'my-password'
    }, nodemailer);

    instance.sendEmail('from', 'to', 'subject', 'html', 'attachments').then(() => {
        mailerMock.verify();

        done();
    });
};

describe('An email service', () => {
    it('defaults its constructor', constructorTest);

    describe('sendEmail', () => {
        it('deals with exceptions', sendEmailExceptionTest);
        it('sends emails', sendEmailTest);
    });
});