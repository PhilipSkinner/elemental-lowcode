const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	apiService		= require("../../../api/lib/apiService");

const constructorTest = (done) => {
	const instance = apiService();
	expect(instance.definitionProvider).not.toBe(null);
	expect(instance.apiInstance).not.toBe(null);
	expect(instance.glob).not.toBe(null);
	expect(instance.path).not.toBe(null);
	done();
};

describe("An API service", () => {
	it("defaults its constructor arguments", constructorTest);
});