const
    sinon 			= require('sinon'),
    typeValidator	= require('../../../src/service.kernel/lib/typeValidator');

const fs = {
    readFile : () => {}
};

const ajv = {
    compile : () => {}
};

const path = {
    join : () => {}
};

const constructorTest = (done) => {
    const instance = typeValidator();
    expect(instance.ajv).not.toBe(null);
    expect(instance.path).not.toBe(null);
    expect(instance.fs).not.toBe(null);
    done();
};

const getDefinitionReadError = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, '../types/type.json').returns('my-type');

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my-type').callsArgWith(1, new Error('oh dear'));

    const instance = typeValidator(fs, path, ajv);

    instance.getTypeDefinition('type').catch((err) => {
        expect(err).toEqual(new Error('oh dear'));

        pathMock.verify();
        fsMock.verify();

        done();
    });
};

const getDefinitionInvalidJson = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, '../types/type.json').returns('my-type');

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my-type').callsArgWith(1, null, "@}{S}{WAD{}W{D}{WAD}{WAD}{WAD");

    const instance = typeValidator(fs, path, ajv);

    instance.getTypeDefinition('type').catch((err) => {
        expect(err).toEqual(new Error('Could not read schema for type'));

        pathMock.verify();
        fsMock.verify();

        done();
    });
};

const validateErrorTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, '../types/type.json').returns('my-type');

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my-type').callsArgWith(1, null, '{"hello":"world"}');

    const valiator = function() {
        valiator.errors = 'some-errors';
        return false;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(valiator);

    const instance = typeValidator(fs, path, ajv);

    instance.validate('type', 'doot').catch((err) => {
        expect(err).toEqual('some-errors');

        pathMock.verify();
        fsMock.verify();
        ajvMock.verify();

        done();
    });
};

const validateTest = (done) => {
        const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, '../types/type.json').returns('my-type');

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my-type').callsArgWith(1, null, '{"hello":"world"}');

    const valiator = function() {
        return true;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(valiator);

    const instance = typeValidator(fs, path, ajv);

    instance.validate('type', 'doot').then(() => {
        pathMock.verify();
        fsMock.verify();
        ajvMock.verify();

        done();
    });
};

describe('A type validator', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('get type definition', () => {
        it('handles file read errors', getDefinitionReadError);
        it('handles invalid json', getDefinitionInvalidJson);
    });

    describe('validate', () => {
        it('returns errors', validateErrorTest);
        it('resolves', validateTest);
    });
});