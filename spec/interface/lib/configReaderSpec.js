const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	configReader 	= require("../../../interface/lib/configReader");

const constructorTest = (done) => {
	const instance = configReader();
	expect(instance.fs).not.toBe(null);
	expect(instance.path).not.toBe(null);
	done();
};

describe("A config reader", () => {
	it("defaults its constructor arguments", constructorTest);
});