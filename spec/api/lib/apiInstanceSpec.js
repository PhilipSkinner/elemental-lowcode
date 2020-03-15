const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	apiInstance		= require("../../../api/lib/apiInstance");

const constructorTest = (done) => {
	const instance = apiInstance();
	expect(instance.roleCheckHandler).not.toBe(null);
	expect(instance.transatives).not.toBe(null);
	expect(instance.singletons).not.toBe(null);
	done();
};

describe("An API instance", () => {
	it("defaults its constructor arguments", constructorTest);
});