const
    jasmine 		= require('jasmine'),
    sinon 			= require('sinon'),
    preProcessor	= require('../../../../src/service.interface/lib/templating/preProcessor');

const constructorTest = (done) => {
    const instance = preProcessor();
    expect(instance.visitors.arrayWrapper).not.toBe(null);
    expect(instance.visitors.expandCustomTags).not.toBe(null);
    expect(instance.visitors.handleLoops).not.toBe(null);
    expect(instance.visitors.replaceValues).not.toBe(null);
    expect(instance.visitors.defineScope).not.toBe(null);
    expect(instance.visitors.bindValues).not.toBe(null);
    expect(instance.visitors.conditionals).not.toBe(null);
    done();
};

describe('A pre-processor', () => {
    it('defaults its constructor arguments', constructorTest);
});