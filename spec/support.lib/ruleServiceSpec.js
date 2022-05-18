const
    sinon 			= require('sinon'),
    ruleService 	= require('../../src/support.lib/ruleService');

const request = {
    post : () => {}
};

const hostnameResolver = {
    resolveRules : () => {}
};

const authClientProvider = {
    getAccessToken : () => {}
};


const constructorTest = (done) => {
    const instance = ruleService();
    expect(instance.request).not.toBe(null);
    done();
};

const callRulesetTest = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveRules').returns('http://rules');

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://rules/ruleset', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer ',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, '{"hello":"world"}');

    const instance = ruleService(request, hostnameResolver);

    instance.callRuleset('ruleset', 'my-entity').then(() => {
        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const callRulesetInvalidJSON = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveRules').returns('http://rules');

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://rules/ruleset', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer ',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, null, {
        statusCode : 200
    }, '}{SD{A}WD{}W{D}AW{D}AW{D}AW{D');

    const instance = ruleService(request, hostnameResolver);

    instance.callRuleset('ruleset', 'my-entity').catch((err) => {
        expect(err).toEqual(new Error('Invalid response received from ruleset call'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const callRulesetInvalidStatusCode = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveRules').returns('http://rules');

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://rules/ruleset', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer ',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, null, {
        statusCode : 500
    }, 'oops');

    const instance = ruleService(request, hostnameResolver);

    instance.callRuleset('ruleset', 'my-entity').catch((err) => {
        expect(err).toEqual('oops');

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const callRulesetRequestError = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveRules').returns('http://rules');

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://rules/ruleset', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer ',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, new Error('oops'));

    const instance = ruleService(request, hostnameResolver);

    instance.callRuleset('ruleset', 'my-entity').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const callRulesetAuthToken = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveRules').returns('http://rules');

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://rules/ruleset', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer my token',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, new Error('oops'));

    const instance = ruleService(request, hostnameResolver);

    instance.callRuleset('ruleset', 'my-entity', 'my token').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

const callRulesetAuthProvider = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveRules').returns('http://rules');

    const requestMock = sinon.mock(request);
    requestMock.expects('post').once().withArgs('http://rules/ruleset', {
        body : '"my-entity"',
        headers : {
            Authorization : 'Bearer a token',
            'content-type' : 'application/json'
        }
    }).callsArgWith(2, new Error('oops'));

    const authClientProviderMock = sinon.mock(authClientProvider);
    authClientProviderMock.expects('getAccessToken').once().returns(Promise.resolve('a token'));

    const instance = ruleService(request, hostnameResolver);
    instance.setAuthClientProvider(authClientProvider);

    instance.callRuleset('ruleset', 'my-entity').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        authClientProviderMock.verify();
        hostnameMock.verify();
        requestMock.verify();

        done();
    });
};

describe('A rules service client', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('call ruleset', () => {
        it('works', callRulesetTest);
        it('handles invalid JSON', callRulesetInvalidJSON);
        it('handles invalid status codes', callRulesetInvalidStatusCode);
        it('handles request errors', callRulesetRequestError);
        it('handles a given auth token', callRulesetAuthToken);
        it('uses the auth provider', callRulesetAuthProvider);
    });
});