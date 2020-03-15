const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	ruleService 	= require("../../shared/ruleService");

const constructorTest = (done) => {
	const instance = ruleService();
	expect(instance.request).not.toBe(null);
	done();
};

describe("A rules service client", () => {
	it("defaults its constructor arguments", constructorTest);
});