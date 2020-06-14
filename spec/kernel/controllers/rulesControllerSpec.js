const
	sinon 			= require("sinon"),
	controller 		= require("../../../kernel/controllers/rulesController");

const constructorTest = (done) => {
	const instance = controller();
	expect(instance.fileLister).not.toBe(null);
	expect(instance.path).not.toBe(null);
	expect(instance.roleCheckHandler).not.toBe(null);
	expect(instance.typeValidator).not.toBe(null);
	done();
};

describe("A rules controller", () => {
	it("defaults its constructor arguments", constructorTest);
});