const
	sinon = require("sinon"),
	queueInstance = require("../../../messaging/lib/queueInstance");

const constructorTest = (done) => {
	const instance = queueInstance();

	expect(instance.roleCheckHandler).not.toBe(null);
	expect(instance.queueProvider).not.toBe(null);
	expect(instance.uuid).not.toBe(null);
	expect(instance.hostnameResolver).not.toBe(null);
	expect(instance.serviceProvider).not.toBe(null);
	expect(instance.storageService).not.toBe(null);
	expect(instance.integrationService).not.toBe(null);
	expect(instance.rulesetService).not.toBe(null);
	expect(instance.idmService).not.toBe(null);
	expect(instance.authClientProvider).not.toBe(null);
	expect(instance.messagingService).not.toBe(null);
	expect(instance.ajv).not.toBe(null);

	done();
};

describe("A messaging queue instance", () => {
	it("handles constructor defaulting", constructorTest);
});