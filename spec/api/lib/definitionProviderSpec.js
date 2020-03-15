const
	jasmine 			= require("jasmine"),
	sinon 				= require("sinon"),
	definitionProvider	= require("../../../api/lib/definitionProvider");

const constructorTest = (done) => {
	const instance = definitionProvider();
	expect(instance.fs).not.toBe(null);
	expect(instance.path).not.toBe(null);
	done();
};

describe("An API definition provider", () => {
	it("defaults its constructor arguments", constructorTest);
});