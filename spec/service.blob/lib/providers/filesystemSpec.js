const
    sinon       = require('sinon'),
    filesystem  = require('../../../../src/service.blob/lib/providers/filesystem');

const fs = {
    statSync    : () => {},
    opendir     : () => {},
    readFile    : () => {},
    writeFile   : () => {},
    remove      : () => {},
};

const path = {
    join        : () => {},
    basename    : () => {},
    relative    : () => {},
    dirname     : () => {},
};

const mkdirp = {
    main : () => {}
};

const mimeTypes = {
    lookup : () => {}
};

const constructorTest = (done) => {
    const instance = filesystem();

    expect(instance.fs).not.toBe(undefined);
    expect(instance.fs).not.toBe(null);
    expect(instance.path).not.toBe(undefined);
    expect(instance.path).not.toBe(null);
    expect(instance.mkdirp).not.toBe(undefined);
    expect(instance.mkdirp).not.toBe(null);
    expect(instance.mimeTypes).not.toBe(undefined);
    expect(instance.mimeTypes).not.toBe(null);

    done();
};

const initTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), sinon.match.any, 'store-path', '').returns('root-path');

    const mkdirpMock = sinon.mock(mkdirp);
    mkdirpMock.expects('main').once().withArgs('root-path').returns(Promise.resolve());

    const instance = filesystem(fs, path, mkdirp.main, mimeTypes);

    instance.init({
        mechanism : {
            path : 'store-path'
        }
    }).then(() => {
        pathMock.verify();
        mkdirpMock.verify();

        done();
    });
};

const getDetailsFolderTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), sinon.match.any, 'store-path', 'a-folder').returns('folder-path');
    pathMock.expects('join').exactly(3).withArgs(process.cwd(), sinon.match.any, 'store-path', '/').returns('root-path');
    pathMock.expects('basename').once().withArgs('folder-path').returns('folder-name');
    pathMock.expects('relative').once().withArgs('root-path', 'folder-path').returns('relative-path');
    pathMock.expects('join').once().withArgs('folder-path', 'a-file').returns('a-file-path');
    pathMock.expects('dirname').once().withArgs('folder-path').returns('folder-dir-name');
    pathMock.expects('relative').once().withArgs('root-path', 'folder-dir-name').returns('parent-folder-path');
    pathMock.expects('basename').once().withArgs('a-file-path').returns('file-name');
    pathMock.expects('relative').once().withArgs('root-path', 'a-file-path').returns('file-path');

    const fsMock = sinon.mock(fs);
    fsMock.expects('statSync').once().withArgs('folder-path').returns({
        isDirectory : () => { return true; },
        atime : 'a-time',
        mtime : 'm-time',
        birthtime : 'birth-time',
        size : 'alot',
    });
    fsMock.expects('statSync').once().withArgs('a-file-path').returns({
        isDirectory : () => { return false; },
        atime : 'a-file-time',
        mtime : 'm-file-time',
        birthtime : 'birth-file-time',
        size : 'file-alot',
    });
    const files = [
        {
            name : 'a-file'
        }
    ];
    fsMock.expects('opendir').once().withArgs('folder-path').callsArgWith(1, null, {
        readSync: () => {
            if (files.length === 0) {
                return null;
            }

            return files.pop();
        },
        close : () => {}
    });

    const mimeTypesMock = sinon.mock(mimeTypes);
    mimeTypesMock.expects('lookup').once().withArgs('folder-path').returns('mime-type');
    mimeTypesMock.expects('lookup').once().withArgs('a-file-path').returns('file-mime-type');

    const mkdirpMock = sinon.mock(mkdirp);
    mkdirpMock.expects('main').once().withArgs('folder-path').returns(Promise.resolve());

    const instance = filesystem(fs, path, mkdirp.main, mimeTypes);

    instance.getDetails({
        mechanism : {
            path : 'store-path'
        }
    }, 'a-folder').then((data) => {
        expect(data).toEqual({
            name : 'folder-name',
            type : 'directory',
            size : '-',
            full_path : 'relative-path',
            last_accessed : 'a-time',
            last_modified : 'm-time',
            created : 'birth-time',
            mime_type : 'mime-type',
            children : [
                {
                    name: '..',
                    type: 'traverse_up',
                    size: '-',
                    full_path: 'parent-folder-path'
                },
                {
                    name: 'file-name',
                    type: 'file',
                    size: 'file-alot',
                    full_path: 'file-path',
                    last_accessed: 'a-file-time',
                    last_modified: 'm-file-time',
                    created: 'birth-file-time',
                    mime_type: 'file-mime-type'
                }
            ]
        });

        pathMock.verify();
        fsMock.verify();
        mimeTypesMock.verify();
        mkdirpMock.verify();

        done();
    });
};

const getRootFolderDetails = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), sinon.match.any, 'store-path', 'a-folder').returns('root-path');
    pathMock.expects('join').exactly(3).withArgs(process.cwd(), sinon.match.any, 'store-path', '/').returns('root-path');
    pathMock.expects('basename').once().withArgs('root-path').returns('folder-name');
    pathMock.expects('relative').once().withArgs('root-path', 'root-path').returns('relative-path');
    pathMock.expects('join').once().withArgs('root-path', 'a-file').returns('a-file-path');
    pathMock.expects('basename').once().withArgs('a-file-path').returns('file-name');
    pathMock.expects('relative').once().withArgs('root-path', 'a-file-path').returns('file-path');

    const fsMock = sinon.mock(fs);
    fsMock.expects('statSync').once().withArgs('root-path').returns({
        isDirectory : () => { return true; },
        atime : 'a-time',
        mtime : 'm-time',
        birthtime : 'birth-time',
        size : 'alot',
    });
    fsMock.expects('statSync').once().withArgs('a-file-path').returns({
        isDirectory : () => { return false; },
        atime : 'a-file-time',
        mtime : 'm-file-time',
        birthtime : 'birth-file-time',
        size : 'file-alot',
    });
    const files = [
        {
            name : 'a-file'
        }
    ];
    fsMock.expects('opendir').once().withArgs('root-path').callsArgWith(1, null, {
        readSync: () => {
            if (files.length === 0) {
                return null;
            }

            return files.pop();
        },
        close : () => {}
    });

    const mimeTypesMock = sinon.mock(mimeTypes);
    mimeTypesMock.expects('lookup').once().withArgs('root-path').returns('mime-type');
    mimeTypesMock.expects('lookup').once().withArgs('a-file-path').returns('file-mime-type');

    const mkdirpMock = sinon.mock(mkdirp);
    mkdirpMock.expects('main').once().withArgs('root-path').returns(Promise.resolve());

    const instance = filesystem(fs, path, mkdirp.main, mimeTypes);

    instance.getDetails({
        mechanism : {
            path : 'store-path'
        }
    }, 'a-folder').then((data) => {
        expect(data).toEqual({
            name : 'folder-name',
            type : 'directory',
            size : '-',
            full_path : 'relative-path',
            last_accessed : 'a-time',
            last_modified : 'm-time',
            created : 'birth-time',
            mime_type : 'mime-type',
            children : [
                {
                    name: 'file-name',
                    type: 'file',
                    size: 'file-alot',
                    full_path: 'file-path',
                    last_accessed: 'a-file-time',
                    last_modified: 'm-file-time',
                    created: 'birth-file-time',
                    mime_type: 'file-mime-type'
                }
            ]
        });

        pathMock.verify();
        fsMock.verify();
        mimeTypesMock.verify();
        mkdirpMock.verify();

        done();
    });
};

const getDetailsErrorTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), sinon.match.any, 'store-path', 'a-folder').returns('folder-path');
    pathMock.expects('join').twice().withArgs(process.cwd(), sinon.match.any, 'store-path', '/').returns('root-path');
    pathMock.expects('basename').once().withArgs('folder-path').returns('folder-name');
    pathMock.expects('relative').once().withArgs('root-path', 'folder-path').returns('relative-path');

    const fsMock = sinon.mock(fs);
    fsMock.expects('statSync').once().withArgs('folder-path').returns({
        isDirectory : () => { return true; },
        atime : 'a-time',
        mtime : 'm-time',
        birthtime : 'birth-time',
        size : 'alot',
    });
    fsMock.expects('opendir').once().withArgs('folder-path').callsArgWith(1, new Error('oh dear'));

    const mimeTypesMock = sinon.mock(mimeTypes);
    mimeTypesMock.expects('lookup').once().withArgs('folder-path').returns('mime-type');

    const mkdirpMock = sinon.mock(mkdirp);
    mkdirpMock.expects('main').once().withArgs('folder-path').returns(Promise.resolve());

    const instance = filesystem(fs, path, mkdirp.main, mimeTypes);

    instance.getDetails({
        mechanism : {
            path : 'store-path'
        }
    }, 'a-folder').catch((err) => {
        expect(err).toEqual(new Error('oh dear'));

        pathMock.verify();
        fsMock.verify();
        mimeTypesMock.verify();
        mkdirpMock.verify();

        done();
    });
};

const getExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), sinon.match.any, 'store-path', 'a-file').returns('file-path');

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('file-path').callsArgWith(1, new Error('oh dear'));

    const instance = filesystem(fs, path, mkdirp.main, mimeTypes);

    instance.get({
        mechanism : {
            path : 'store-path'
        }
    }, 'a-file').catch((err) => {
        expect(err).toEqual(new Error('oh dear'));

        pathMock.verify();
        fsMock.verify();

        done();
    });
};

const getTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), sinon.match.any, 'store-path', 'a-file').returns('file-path');

    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('file-path').callsArgWith(1, null, 'some-data');

    const instance = filesystem(fs, path, mkdirp.main, mimeTypes);

    instance.get({
        mechanism : {
            path : 'store-path'
        }
    }, 'a-file').then((data) => {
        expect(data).toEqual('some-data');

        pathMock.verify();
        fsMock.verify();

        done();
    });
};

const createFolderTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), sinon.match.any, 'store-path', 'a-folder').returns('folder-path');

    const mkdirpMock = sinon.mock(mkdirp);
    mkdirpMock.expects('main').once().withArgs('folder-path').returns(Promise.resolve());

    const instance = filesystem(fs, path, mkdirp.main, mimeTypes);

    instance.createFolder({
        mechanism : {
            path : 'store-path'
        }
    }, 'a-folder').then(() => {
        pathMock.verify();
        mkdirpMock.verify();

        done();
    });
};

const putExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), sinon.match.any, 'store-path', 'a-file').returns('file-path');
    pathMock.expects('dirname').once().withArgs('file-path').returns('parent-folder-path');

    const mkdirpMock = sinon.mock(mkdirp);
    mkdirpMock.expects('main').once().withArgs('parent-folder-path').returns(Promise.resolve());

    const fsMock = sinon.mock(fs);
    fsMock.expects('writeFile').once().withArgs('file-path', 'some-data').callsArgWith(2, new Error('oh dear'));

    const instance = filesystem(fs, path, mkdirp.main, mimeTypes);

    instance.put({
        mechanism : {
            path : 'store-path'
        }
    }, 'a-file', 'some-data').catch((err) => {
        expect(err).toEqual(new Error('oh dear'));

        pathMock.verify();
        mkdirpMock.verify();
        fsMock.verify();

        done();
    });
};

const putTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), sinon.match.any, 'store-path', 'a-file').returns('file-path');
    pathMock.expects('dirname').once().withArgs('file-path').returns('parent-folder-path');

    const mkdirpMock = sinon.mock(mkdirp);
    mkdirpMock.expects('main').once().withArgs('parent-folder-path').returns(Promise.resolve());

    const fsMock = sinon.mock(fs);
    fsMock.expects('writeFile').once().withArgs('file-path', 'some-data').callsArgWith(2, null);

    const instance = filesystem(fs, path, mkdirp.main, mimeTypes);

    instance.put({
        mechanism : {
            path : 'store-path'
        }
    }, 'a-file', 'some-data').then(() => {
        pathMock.verify();
        mkdirpMock.verify();
        fsMock.verify();

        done();
    });
};

const deleteExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), sinon.match.any, 'store-path', 'a-file').returns('file-path');
    pathMock.expects('dirname').once().withArgs('file-path').returns('parent-folder-path');

    const mkdirpMock = sinon.mock(mkdirp);
    mkdirpMock.expects('main').once().withArgs('parent-folder-path').returns(Promise.resolve());

    const fsMock = sinon.mock(fs);
    fsMock.expects('remove').once().withArgs('file-path').callsArgWith(1, new Error('oh dear'));

    const instance = filesystem(fs, path, mkdirp.main, mimeTypes);

    instance.delete({
        mechanism : {
            path : 'store-path'
        }
    }, 'a-file').catch((err) => {
        expect(err).toEqual(new Error('oh dear'));

        pathMock.verify();
        mkdirpMock.verify();
        fsMock.verify();

        done();
    });
};

const deleteTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), sinon.match.any, 'store-path', 'a-file').returns('file-path');
    pathMock.expects('dirname').once().withArgs('file-path').returns('parent-folder-path');

    const mkdirpMock = sinon.mock(mkdirp);
    mkdirpMock.expects('main').once().withArgs('parent-folder-path').returns(Promise.resolve());

    const fsMock = sinon.mock(fs);
    fsMock.expects('remove').once().withArgs('file-path').callsArgWith(1, null);

    const instance = filesystem(fs, path, mkdirp.main, mimeTypes);

    instance.delete({
        mechanism : {
            path : 'store-path'
        }
    }, 'a-file').then(() => {
        pathMock.verify();
        mkdirpMock.verify();
        fsMock.verify();

        done();
    });
};

describe('A filesystem blob provider', () => {
    it('supports constructor defaulting', constructorTest);

    describe('init', () => {
        it('ensures the root folder exists', initTest);
    });

    describe('getDetails', () => {
        it('gets the details of folders', getDetailsFolderTest);
        it('gets the details of the root folder', getRootFolderDetails);
        it('handles folder list errors', getDetailsErrorTest);
    });

    describe('get', () => {
        it('handles exceptions', getExceptionTest);
        it('works', getTest);
    });

    describe('createFolder', () => {
        it('creates the folder', createFolderTest);
    });

    describe('put', () => {
        it('handles exceptions', putExceptionTest);
        it('works', putTest);
    });

    describe('delete', () => {
        it('handles exceptions', deleteExceptionTest);
        it('works', deleteTest);
    });
});