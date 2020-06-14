const
	sinon = require("sinon"),
	sqlQueue = require("../../../../messaging/lib/queues/sqlQueue");

const sqlStore = function() {
	return {

	};
};

const constructorTest = (done) => {
	const instance = sqlQueue("", sqlStore);

	expect(instance.name).not.toBe(null);
	expect(instance.messageDefinition).not.toBe(null);
	expect(instance.sqlStore).not.toBe(null);

	done();
};

describe("A sql queue service", () => {
	it("handles constructor defaulting", constructorTest);
});