const
	sinon 			= require("sinon"),
	serviceRunner 	= require("../../../kernel/lib/serviceRunner");

const constructorTest = (done) => {
	const instance = serviceRunner();
	expect(instance.childProcess).not.toBe(null);
	expect(instance.nodeProcess).not.toBe(null);
	done();
};

describe("A service runner", () => {
	it("defaults its constructor arguments", constructorTest);
});