const
    sinon 			= require('sinon'),
    setup 			= require('../../src/service.kernel/setup');

const fs = {
    existsSync : () => {}
};
const path = {
    join : () => {}
};
const inquirer = {};
const idm = {};

const constructorTest = (done) => {
    const instance = setup();
    expect(instance.inquirer).not.toBe(null);
    expect(instance.idm).not.toBe(null);
    expect(instance.path).not.toBe(null);
    expect(instance.fs).not.toBe(null);
    done();
};

const determineSetup = (done) => {
    const instance = setup(fs, path, inquirer, idm);

    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', 'db.sqlite').returns('my-path');

    const fsMock = sinon.mock(fs);
    fsMock.expects('existsSync').once().withArgs('my-path').returns(true);

    expect(instance.shouldRun('my-dir')).toEqual(false);

    pathMock.verify();
    fsMock.verify();

    done();
};

const runSetup = (done) => {
    const instance = setup(fs, path, inquirer, idm);

    instance.runSetup().then(() => {
        done();
    });
};

describe('An interactive setup provider', () => {
    it('defaults its constructor arguments', constructorTest);
    it('can determine if setup should run', determineSetup);
    it('can run setup', runSetup);
});