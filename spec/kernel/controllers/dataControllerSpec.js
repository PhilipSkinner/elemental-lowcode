const
	sinon 			= require("sinon"),
	controller 		= require("../../../kernel/controllers/dataController");

const constructorTest = (done) => {
	const instance = controller();
	expect(instance.fileLister).not.toBe(null);
	expect(instance.storageService).not.toBe(null);
	expect(instance.roleCheckHandler).not.toBe(null);
	expect(instance.path).not.toBe(null);
	expect(instance.typeValidator).not.toBe(null);
	done();
};

describe("A data controller", () => {
	it("defaults its constructor arguments", constructorTest);
});