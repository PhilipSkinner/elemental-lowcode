const
	jasmine 			= require("jasmine"),
	sinon 				= require("sinon"),
	integrationService	= require("../../../integration/lib/integrationService");

const constructorTest = (done) => {
	const instance = integrationService();
	expect(instance.configReader).not.toBe(null);
	expect(instance.integrationInstance).not.toBe(null);
	expect(instance.roleCheckHandler).not.toBe(null);
	expect(instance.hostedEndpoints).not.toBe(null);
	done();
};

describe("An integration service", () => {
	it("defaults its constructor arguments", constructorTest);
});