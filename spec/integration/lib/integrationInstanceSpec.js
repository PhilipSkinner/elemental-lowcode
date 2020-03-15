const
	jasmine 			= require("jasmine"),
	sinon 				= require("sinon"),
	integrationInstance	= require("../../../integration/lib/integrationInstance");

const constructorTest = (done) => {
	const instance = integrationInstance();
	expect(instance.requestService).not.toBe(null);
	expect(instance.jsonSchemaVerifier).not.toBe(null);
	done();
};

describe("An integration instance", () => {
	it("defaults its constructor arguments", constructorTest);
});