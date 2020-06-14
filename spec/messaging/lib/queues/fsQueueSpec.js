const
	sinon = require("sinon"),
	fsQueue = require("../../../../messaging/lib/queues/fsQueue");

const constructorTest = (done) => {
	const instance = fsQueue();

	expect(instance.path).not.toBe(null);
	expect(instance.fs).not.toBe(null);
	expect(instance.mkdirp).not.toBe(null);

	done();
};

describe("A fs queue service", () => {
	it("handles constructor defaulting", constructorTest);
});