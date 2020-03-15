const
	jasmine 			= require("jasmine"),
	sinon 				= require("sinon"),
	integrationService 	= require("../../shared/integrationService");

const constructorTest = (done) => {
	const instance = integrationService();
	expect(instance.request).not.toBe(null);
	done();
};

describe("An integrations service client", () => {
	it("defaults its constructor arguments", constructorTest);
});