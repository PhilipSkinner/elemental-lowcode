const
    sinon           = require('sinon'),
    abortController = require('../../../../src/service.identity.idp/lib/controllers/abortController');

const provider = {
    interactionFinished : () => {}
};

const abortRequestInteractionError = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionFinished').once().withArgs('request', 'response', {
        error : 'access_denied',
        error_description : 'End-User aborted interaction'
    }, {
        mergeWithLastSubmission : false
    }).returns(Promise.reject(new Error('oops')));

    const instance = abortController(provider);

    instance.abortRequest('request', 'response', (err) => {
        expect(err).toEqual(new Error('oops'));

        providerMock.verify();

        done();
    });
};

const abortRequestTest = (done) => {
    const providerMock = sinon.mock(provider);
    providerMock.expects('interactionFinished').once().withArgs('request', 'response', {
        error : 'access_denied',
        error_description : 'End-User aborted interaction'
    }, {
        mergeWithLastSubmission : false
    }).returns(Promise.resolve());

    const instance = abortController(provider);
    instance.abortRequest('request', 'response');

    providerMock.verify();
    done();
};

describe('An abort controller', () => {
    describe('abort request', () => {
        it('can handle interaction errors', abortRequestInteractionError);
        it('aborts the interaction', abortRequestTest);
    });
});