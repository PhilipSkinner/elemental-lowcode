const
    jasmine 		= require('jasmine'),
    sinon 			= require('sinon'),
    typesReader		= require('../../../src/service.data/lib/typesReader');

const glob = {
    main : () => {}
};

const path = {
    join : () => {}
};

const fs = {
    readFile : () => {}
};

const constructorTest = (done) => {
    const instance = typesReader();
    expect(instance.glob).not.toBe(null);
    expect(instance.fs).not.toBe(null);
    expect(instance.path).not.toBe(null);
    done();
};

const findTypesErrorTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, 'dir', '**/*.json').returns('search-path');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('search-path').callsArgWith(1, new Error('oh noes'));

    const instance = typesReader(glob.main, fs, path);
    instance.findTypes('dir').catch((err) => {
        expect(err).toEqual(new Error('oh noes'));

        pathMock.verify();
        globMock.verify();

        done();
    });
};

const findTypesTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, 'dir', '**/*.json').returns('search-path');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('search-path').callsArgWith(1, null, 'some files');

    const instance = typesReader(glob.main, fs, path);
    instance.findTypes('dir').then((files) => {
        expect(files).toEqual('some files');

        pathMock.verify();
        globMock.verify();

        done();
    });
};

const parseTypeFileErrorTest = (done) => {
    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my-file').callsArgWith(1, new Error('oh dear'));

    const instance = typesReader(glob.main, fs, path);

    instance.parseType('my-file').catch((err) => {
        expect(err).toEqual(new Error('oh dear'));

        fsMock.verify();

        done();
    });
};

const parseTypeInvalidJsonTest = (done) => {
    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my-file').callsArgWith(1, null, '{}}{SDF}{}D{W£${$SKDFJKSJFKJFKKJFKJ""KJ"KJ"');

    const instance = typesReader(glob.main, fs, path);

    instance.parseType('my-file').catch((err) => {
        expect(err).toEqual(new Error('Could not parse type file my-file'));

        fsMock.verify();

        done();
    });
};

const parseTypeTest = (done) => {
    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my-file').callsArgWith(1, null, '{"hello":"world"}');

    const instance = typesReader(glob.main, fs, path);

    instance.parseType('my-file').then((data) => {
        expect(data).toEqual({
            hello : 'world'
        });

        fsMock.verify();

        done();
    });
};

const readTypesTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, 'dir', '**/*.json').returns('search-path');

    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('search-path').callsArgWith(1, null, ['my-file']);

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my-file').callsArgWith(1, null, '{"hello":"world"}');

    const instance = typesReader(glob.main, fs, path);
    instance.readTypes('dir').then((config) => {
        expect(config).toEqual([
            {
                hello : "world"
            }
        ])

        pathMock.verify();
        globMock.verify();
        fsMock.verify();

        done();
    });
};

describe('A storage types reader', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('can find types', () => {
        it('handling errors', findTypesErrorTest);
        it('correctly', findTypesTest);
    });

    describe('can parse types', () => {
        it('handling fs errors', parseTypeFileErrorTest);
        it('handling invalid json', parseTypeInvalidJsonTest);
        it('correctly', parseTypeTest);
    });

    it('can read types', readTypesTest);
});