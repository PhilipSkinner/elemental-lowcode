const
    jasmine 			= require('jasmine'),
    sinon 				= require('sinon'),
    jsonSchemaVerifier	= require('../../../src/service.integration/lib/jsonSchemaVerifier');

const ajv = {
    compile 	: () => {},
    validate 	: () => {
        return true;
    }
};

const constructorTest = (done) => {
    const instance = jsonSchemaVerifier();
    expect(instance.ajv).not.toBe(null);
    done();
};

const verifyTest = (done) => {
    const ajvMock = sinon.mock(ajv);
    ajv.validate = () => {
        return true;
    };
    ajvMock.expects('compile').once().withArgs({
        config : 'here'
    }).returns(ajv.validate);

    const instance = jsonSchemaVerifier(ajv);
    const result = instance.verify({
        config : 'here'
    }, JSON.stringify({
        hello : 'world'
    }));

    ajvMock.verify();

    expect(result).toEqual({
        data : {
            hello : 'world'
        }
    });

    done();
};

const errorTest = (done) => {
    const ajvMock = sinon.mock(ajv);
    ajv.validate = function() {
        return false;
    };
    ajvMock.expects('compile').once().withArgs({
        config : 'here'
    }).returns(ajv.validate);

    const instance = jsonSchemaVerifier(ajv);
    const result = instance.verify({
        config : 'here'
    }, JSON.stringify({
        hello : 'world'
    }));

    ajvMock.verify();

    expect(result).toEqual({
        errors : undefined
    });

    done();
};

const invalidJSONTest = (done) => {
    const ajvMock = sinon.mock(ajv);
    ajv.validate = function() {
        return false;
    };
    ajvMock.expects('compile').once().withArgs({
        config : 'here'
    }).returns(ajv.validate);

    const instance = jsonSchemaVerifier(ajv);
    const result = instance.verify({
        config : 'here'
    }, '{}{SD}{AS}D{}SAD{');
    ajvMock.verify();

    expect(result).toEqual({
        errors : undefined
    });

    done();
};


describe('A JSON schema verifier', () => {
    it('defaults its constructor arguments', constructorTest);
    it('can verify JSON', verifyTest);
    it('handles verification errors', errorTest);
    it('handles invalid JSON', invalidJSONTest);
});