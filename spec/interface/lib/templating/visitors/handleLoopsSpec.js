const
	jasmine 	= require("jasmine"),
	sinon 		= require("sinon"),
	handleLoops	= require("../../../../../interface/lib/templating/visitors/handleLoops");

const constructorTest = (done) => {
	const instance = handleLoops();
	expect(instance.dataResolver).not.toBe(null);
	done();
};

describe("A loop handler", () => {
	it("defaults its constructor arguments", constructorTest);
});