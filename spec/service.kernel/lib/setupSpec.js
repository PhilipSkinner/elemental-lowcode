const
    sinon 			= require('sinon'),
    setup 			= require('../../../src/service.kernel/lib/setup');

const mkdirp = {
    main : () => {}
};

const path = {
    join : () => {}
};

const fs = {
    stat : () => {},
    writeFile : () => {}
};

const constructorTest = (done) => {
    const instance = setup();
    expect(instance.mkdirp).not.toBe(null);
    expect(instance.path).not.toBe(null);
    expect(instance.fs).not.toBe(null);
    done();
};

const setupTest = (done) => {
    const mkdirpMock = sinon.mock(mkdirp);
    mkdirpMock.expects('main').once().withArgs('woot').returns(Promise.resolve());
    mkdirpMock.expects('main').once().withArgs('services').returns(Promise.resolve());

    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('services', 'package.json').returns('services-package');

    const fsMock = sinon.mock(fs);
    fsMock.expects('stat').once().withArgs('services-package').callsArgWith(1, new Error('there'));
    fsMock.expects('writeFile').once().withArgs('services-package').callsArgWith(2, null);

    const instance = setup(mkdirp.main, path, fs);

    instance.setupEnvironment({
        woot : 'woot',
        services : 'services'
    }).then(() => {
        mkdirpMock.verify();
        pathMock.verify();
        fsMock.verify();

        done();
    });
};

const ensureAlreadyExists = (done) => {
    const fsMock = sinon.mock(fs);
    fsMock.expects('stat').once().withArgs('services-package').callsArgWith(1, null);

    const instance = setup(mkdirp.main, path, fs);

    instance.ensureFile('services-package').then(() => {
        fsMock.verify();

        done();
    });
};

const ensureWriteError = (done) => {
    const fsMock = sinon.mock(fs);
    fsMock.expects('stat').once().withArgs('services-package').callsArgWith(1, new Error('there'));
    fsMock.expects('writeFile').once().withArgs('services-package').callsArgWith(2, new Error('oops'));

    const instance = setup(mkdirp.main, path, fs);

    instance.ensureFile('services-package').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        fsMock.verify();

        done();
    });
};

describe('A setup provider', () => {
    it('defaults its constructor arguments', constructorTest);
    it('can setup an environment', setupTest);

    describe('ensure file', () => {
        it('handles files that already exist', ensureAlreadyExists);
        it('handles file write errors', ensureWriteError);
    });
});