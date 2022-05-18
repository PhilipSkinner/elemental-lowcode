const
    sinon 			= require('sinon'),
    setup 			= require('../../src/service.kernel/setup');

const constructorTest = (done) => {
    const instance = setup();
    expect(instance.inquirer).not.toBe(null);
    expect(instance.idm).not.toBe(null);
    expect(instance.path).not.toBe(null);
    expect(instance.fs).not.toBe(null);
    done();
};

describe('An interactive setup provider', () => {
    it('defaults its constructor arguments', constructorTest);
});