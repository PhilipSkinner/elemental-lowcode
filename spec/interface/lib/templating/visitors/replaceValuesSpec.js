const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	replaceValues	= require("../../../../../interface/lib/templating/visitors/replaceValues");

const constructorTest = (done) => {
	const instance = replaceValues();
	expect(instance.dataResolver).not.toBe(null);
	done();
};

describe("A value substituter", () => {
	it("defaults its constructor arguments", constructorTest);
});