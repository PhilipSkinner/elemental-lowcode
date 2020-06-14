const
	sinon = require("sinon"),
	queueService = require("../../../messaging/lib/queueService");

const constructorTest = (done) => {
	const instance = queueService();

	expect(instance.path).not.toBe(null);
	expect(instance.glob).not.toBe(null);
	expect(instance.definitionProvider).not.toBe(null);
	expect(instance.queueInstance).not.toBe(null);

	done();
};

describe("A messaging queue service", () => {
	it("handles constructor defaulting", constructorTest);
});