const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	rulesService 	= require("../../../rules/lib/rulesService");

const constructorTest = (done) => {
	const instance = rulesService();
	expect(instance.fs).not.toBe(null);
	expect(instance.path).not.toBe(null);
	expect(instance.glob).not.toBe(null);
	expect(instance.configReader).not.toBe(null);
	expect(instance.rulesInstance).not.toBe(null);
	done();
};

describe("A rules service", () => {
	it("defaults its constructor arguments", constructorTest);
});