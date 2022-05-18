const
    sinon 			= require('sinon'),
    fileLister 		= require('../../../src/service.kernel/lib/fileLister');

const path = {
    join : () => {},
    basename : () => {},
    dirname : () => {}
};

const fs = {
    writeFile : () => {},
    readFile : () => {},
    unlink : () => {},
};

const glob = {
    main : () => {}
};

const mkdirp = {
    main: () => {}
};

const tar = {
    x : () => {},
    c : () => {}
};

const constructorTest = (done) => {
    const instance = fileLister();
    expect(instance.path).not.toBe(null);
    expect(instance.fs).not.toBe(null);
    expect(instance.glob).not.toBe(null);
    expect(instance.mkdirp).not.toBe(null);
    expect(instance.tar).not.toBe(null);
    done();
};

const extractTarExceptionTest = (done) => {
    const mkdirpMock = sinon.mock(mkdirp);
    mkdirpMock.expects('main').once().withArgs('the-dir').returns(Promise.resolve());

    const pathMock = sinon.mock(path);
    pathMock.expects('join').exactly(4).withArgs(process.cwd(), sinon.match.any).returns('my-tar');
    pathMock.expects('dirname').once().withArgs('my-tar').returns('the-dir');

    const fsMock = sinon.mock(fs);
    fsMock.expects('writeFile').once().withArgs('my-tar', 'buffer').callsArgWith(2, null);

    const tarMock = sinon.mock(tar);
    tarMock.expects('x').once().returns(Promise.reject(new Error('not good :(')));

    const instance = fileLister(path, fs, glob.main, mkdirp.main, tar);

    instance.extractTar('dir', 'buffer').catch((err) => {
        expect(err).toEqual(new Error('not good :('));

        mkdirpMock.verify();
        pathMock.verify();
        fsMock.verify();
        tarMock.verify();

        done();
    });
};

const extractTarTest = (done) => {
    const mkdirpMock = sinon.mock(mkdirp);
    mkdirpMock.expects('main').once().withArgs('the-dir').returns(Promise.resolve());
    mkdirpMock.expects('main').once().withArgs(process.cwd()).returns(Promise.resolve());

    const pathMock = sinon.mock(path);
    pathMock.expects('join').exactly(5).withArgs(process.cwd(), sinon.match.any).returns('my-tar');
    pathMock.expects('dirname').once().withArgs('my-tar').returns('the-dir');

    const fsMock = sinon.mock(fs);
    fsMock.expects('writeFile').once().withArgs('my-tar', 'buffer').callsArgWith(2, null);
    fsMock.expects('unlink').once().withArgs('my-tar').callsArgWith(1, null);

    const tarMock = sinon.mock(tar);
    tarMock.expects('x').once().returns(Promise.resolve());

    const instance = fileLister(path, fs, glob.main, mkdirp.main, tar);

    instance.extractTar('dir', 'buffer').then(() => {
        mkdirpMock.verify();
        pathMock.verify();
        fsMock.verify();
        tarMock.verify();

        done();
    });
};

const extractTarAbsoluteTest = (done) => {
    const mkdirpMock = sinon.mock(mkdirp);
    mkdirpMock.expects('main').once().withArgs(process.cwd()).returns(Promise.resolve());
    mkdirpMock.expects('main').once().withArgs('the-dir').returns(Promise.resolve());

    const pathMock = sinon.mock(path);
    pathMock.expects('join').exactly(4).withArgs(process.cwd(), sinon.match.any).returns('my-tar');
    pathMock.expects('dirname').once().withArgs('my-tar').returns('the-dir');

    const fsMock = sinon.mock(fs);
    fsMock.expects('writeFile').once().withArgs('my-tar', 'buffer').callsArgWith(2, null);
    fsMock.expects('unlink').once().withArgs('my-tar').callsArgWith(1, null);

    const tarMock = sinon.mock(tar);
    tarMock.expects('x').once().withArgs({
        file : 'my-tar',
        cwd : '/dir'
    }).returns(Promise.resolve());

    const instance = fileLister(path, fs, glob.main, mkdirp.main, tar);

    instance.extractTar('/dir', 'buffer').then(() => {
        mkdirpMock.verify();
        pathMock.verify();
        fsMock.verify();
        tarMock.verify();

        done();
    });
};

const tarDirExceptionTest = (done) => {
    const mkdirpMock = sinon.mock(mkdirp);
    mkdirpMock.expects('main').once().withArgs('dir').returns(Promise.resolve());

    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), 'dir').returns('my-dir');

    const tarMock = sinon.mock(tar);
    tarMock.expects('c').once().returns(Promise.reject(new Error('oh noes')));

    const instance = fileLister(path, fs, glob.main, mkdirp.main, tar);

    instance.tarDir('dir').catch((err) => {
        expect(err).toEqual(new Error('oh noes'));

        mkdirpMock.verify();
        pathMock.verify();
        tarMock.verify();

        done();
    });
};

const tarDirTest = (done) => {
    const mkdirpMock = sinon.mock(mkdirp);
    mkdirpMock.expects('main').once().withArgs('dir').returns(Promise.resolve());
    mkdirpMock.expects('main').twice().withArgs(process.cwd()).returns(Promise.resolve());

    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), 'dir').returns('my-dir');
    pathMock.expects('join').twice().withArgs(process.cwd(), sinon.match.any).returns('my-tarball');

    const tarMock = sinon.mock(tar);
    tarMock.expects('c').once().returns(Promise.resolve());

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my-tarball').callsArgWith(1, null, 'a lovely tarball');
    fsMock.expects('unlink').once().withArgs('my-tarball').callsArgWith(1, null);

    const instance = fileLister(path, fs, glob.main, mkdirp.main, tar);

    instance.tarDir('dir').then((buff) => {
        expect(buff).toEqual('a lovely tarball');

        mkdirpMock.verify();
        pathMock.verify();
        tarMock.verify();
        fsMock.verify();

        done();
    });
};

const tarDirAbsoluteTest = (done) => {
    const mkdirpMock = sinon.mock(mkdirp);
    mkdirpMock.expects('main').once().withArgs('/dir').returns(Promise.resolve());
    mkdirpMock.expects('main').twice().withArgs(process.cwd()).returns(Promise.resolve());

    const pathMock = sinon.mock(path);
    pathMock.expects('join').twice().withArgs(process.cwd(), sinon.match.any).returns('my-tarball');

    const tarMock = sinon.mock(tar);
    tarMock.expects('c').once().returns(Promise.resolve());

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my-tarball').callsArgWith(1, null, 'a lovely tarball');
    fsMock.expects('unlink').once().withArgs('my-tarball').callsArgWith(1, null);

    const instance = fileLister(path, fs, glob.main, mkdirp.main, tar);

    instance.tarDir('/dir').then((buff) => {
        expect(buff).toEqual('a lovely tarball');

        mkdirpMock.verify();
        pathMock.verify();
        tarMock.verify();
        fsMock.verify();

        done();
    });
};

const globExceptionTest = (done) => {
    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('all-the-woot').callsArgWith(1, new Error('not good'));

    const instance = fileLister(path, fs, glob.main, mkdirp.main, tar);

    instance.executeGlob('all-the-woot').catch((err) => {
        expect(err).toEqual(new Error('not good'));

        globMock.verify();

        done();
    });
};

const globTest = (done) => {
    const globMock = sinon.mock(glob);
    globMock.expects('main').once().withArgs('all-the-woot').callsArgWith(1, null, [
        'a-result'
    ]);

    const pathMock = sinon.mock(path);
    pathMock.expects('basename').twice().withArgs('a-result').returns('base.name');

    const instance = fileLister(path, fs, glob.main, mkdirp.main, tar);

    instance.executeGlob('all-the-woot').then((results) => {
        expect(results).toEqual([
            {
                path : 'a-result',
                basename : 'base.name',
                name : 'base'
            }
        ]);

        globMock.verify();
        pathMock.verify();

        done();
    });
};

const readFileExceptionTest = (done) => {
    const mkdirpMock = sinon.mock(mkdirp);
    mkdirpMock.expects('main').once().withArgs('dir').returns(Promise.resolve());

    const pathMock = sinon.mock(path);
    pathMock.expects('join').withArgs('dir', 'file').returns('my-file');

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my-file').callsArgWith(1, new Error('bad times'));

    const instance = fileLister(path, fs, glob.main, mkdirp.main, tar);

    instance.readFile('dir', 'file').catch((err) => {
        expect(err).toEqual(new Error('bad times'));

        mkdirpMock.verify();
        pathMock.verify();
        fsMock.verify();

        done();
    });
};

const readFileNoneBinary = (done) => {
    const mkdirpMock = sinon.mock(mkdirp);
    mkdirpMock.expects('main').once().withArgs('dir').returns(Promise.resolve());

    const pathMock = sinon.mock(path);
    pathMock.expects('join').withArgs('dir', 'file').returns('my-file');

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my-file').callsArgWith(1, null, Buffer.from('hello'));

    const instance = fileLister(path, fs, glob.main, mkdirp.main, tar);

    instance.readFile('dir', 'file').then((data) => {
        expect(data).toEqual('hello');

        mkdirpMock.verify();
        pathMock.verify();
        fsMock.verify();

        done();
    });
};

const writeFileExceptionTest = (done) => {
    const mkdirpMock = sinon.mock(mkdirp);
    mkdirpMock.expects('main').once().withArgs('the-dir').returns(Promise.resolve());

    const pathMock = sinon.mock(path);
    pathMock.expects('join').twice().withArgs('dir', 'file').returns('my-file');
    pathMock.expects('dirname').once().withArgs('my-file').returns('the-dir');

    const fsMock = sinon.mock(fs);
    fsMock.expects('writeFile').once().withArgs('my-file').callsArgWith(2, new Error('bad times'));

    const instance = fileLister(path, fs, glob.main, mkdirp.main, tar);

    instance.writeFile('dir', 'file').catch((err) => {
        expect(err).toEqual(new Error('bad times'));

        mkdirpMock.verify();
        pathMock.verify();
        fsMock.verify();

        done();
    });
};

const deleteFileExceptionTest = (done) => {
    const mkdirpMock = sinon.mock(mkdirp);
    mkdirpMock.expects('main').once().withArgs('dir').returns(Promise.resolve());

    const pathMock = sinon.mock(path);
    pathMock.expects('join').withArgs('dir', 'file').returns('my-file');

    const fsMock = sinon.mock(fs);
    fsMock.expects('unlink').once().withArgs('my-file').callsArgWith(1, new Error('bad times'));

    const instance = fileLister(path, fs, glob.main, mkdirp.main, tar);

    instance.deleteFile('dir', 'file').catch((err) => {
        expect(err).toEqual(new Error('bad times'));

        mkdirpMock.verify();
        pathMock.verify();
        fsMock.verify();

        done();
    });
};

const readJsonErrorTest = (done) => {
    const mkdirpMock = sinon.mock(mkdirp);
    mkdirpMock.expects('main').once().withArgs('dir').returns(Promise.resolve());

    const pathMock = sinon.mock(path);
    pathMock.expects('join').withArgs('dir', 'file').returns('my-file');

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my-file').callsArgWith(1, new Error('bad times'));

    const instance = fileLister(path, fs, glob.main, mkdirp.main, tar);

    instance.readJSONFile('dir', 'file').catch((err) => {
        expect(err).toEqual(new Error('bad times'));

        mkdirpMock.verify();
        pathMock.verify();
        fsMock.verify();

        done();
    });
};

const readJsonNotJsonTest = (done) => {
    const mkdirpMock = sinon.mock(mkdirp);
    mkdirpMock.expects('main').once().withArgs('dir').returns(Promise.resolve());

    const pathMock = sinon.mock(path);
    pathMock.expects('join').withArgs('dir', 'file').returns('my-file');

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my-file').callsArgWith(1, null, "@}{S}{D}SD{}W{D}W{D}{W}{D}{W}A{D");

    const instance = fileLister(path, fs, glob.main, mkdirp.main, tar);

    instance.readJSONFile('dir', 'file').catch((err) => {
        expect(err).toEqual(new Error('Cannot parse file file in dir'));

        mkdirpMock.verify();
        pathMock.verify();
        fsMock.verify();

        done();
    });
};

const readJsonTest = (done) => {
        const mkdirpMock = sinon.mock(mkdirp);
    mkdirpMock.expects('main').once().withArgs('dir').returns(Promise.resolve());

    const pathMock = sinon.mock(path);
    pathMock.expects('join').withArgs('dir', 'file').returns('my-file');

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my-file').callsArgWith(1, null, '{"hello":"world"}');

    const instance = fileLister(path, fs, glob.main, mkdirp.main, tar);

    instance.readJSONFile('dir', 'file').then((data) => {
        expect(data).toEqual({
            hello : "world"
        });

        mkdirpMock.verify();
        pathMock.verify();
        fsMock.verify();

        done();
    });
};

describe('A file lister', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('extract tar', () => {
        it('allows errors to fall through', extractTarExceptionTest);
        it('works', extractTarTest);
        it('works with absolute paths', extractTarAbsoluteTest);
    });

    describe('tar dir', () => {
        it('allows errors to fall through', tarDirExceptionTest);
        it('works', tarDirTest);
        it('works with absolute paths', tarDirAbsoluteTest);
    });

    describe('execute glob', () => {
        it('handles exceptions', globExceptionTest);
        it('works', globTest);
    });

    describe('read file', () => {
        it('handles exceptions', readFileExceptionTest);
        it('handles none binary files', readFileNoneBinary);
    });

    describe('write file', () => {
        it('handles exceptions', writeFileExceptionTest);
    });

    describe('delete file', () => {
        it('handles exceptions', deleteFileExceptionTest);
    });

    describe('reading a JSON file', () => {
        it('handles file read errors', readJsonErrorTest);
        it('handles json parsing errors', readJsonNotJsonTest);
        it('works', readJsonTest);
    });
});