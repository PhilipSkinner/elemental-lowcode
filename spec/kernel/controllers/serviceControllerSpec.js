const
	sinon 			= require("sinon"),
	controller 		= require("../../../kernel/controllers/serviceController");

const constructorTest = (done) => {
	const instance = controller();
	expect(instance.fileLister).not.toBe(null);
	expect(instance.path).not.toBe(null);
	expect(instance.roleCheckHandler).not.toBe(null);
	expect(instance.childProcess).not.toBe(null);
	done();
};

describe("A service controller", () => {
	it("defaults its constructor arguments", constructorTest);
});