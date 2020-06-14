const
	sinon 			= require("sinon"),
	db 				= require("../../shared/db");

const constructorTest = (done) => {
	const instance = db();
	expect(instance.fs).not.toBe(null);
	expect(instance.path).not.toBe(null);
	expect(instance.glob).not.toBe(null);
	expect(instance.fsStore).not.toBe(null);
	expect(instance.memoryStore).not.toBe(null);
	expect(instance.sqlStore).not.toBe(null);
	done();
};

describe("A db provider", () => {
	it("defaults its constructor arguments", constructorTest);
});