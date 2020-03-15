const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	configReader	= require("../../../integration/lib/configReader");

const constructorTest = (done) => {
	const instance = configReader();
	expect(instance.roleCheckHandler).not.toBe(null);
	expect(instance.transatives).not.toBe(null);
	expect(instance.singletons).not.toBe(null);
	done();
};

describe("A config reader", () => {
	it("defaults its constructor arguments", constructorTest);
});