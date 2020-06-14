const
	sinon 			= require("sinon"),
	controller 		= require("../../../kernel/controllers/websitesController");

const constructorTest = (done) => {
	const instance = controller();
	expect(instance.fileLister).not.toBe(null);
	expect(instance.path).not.toBe(null);
	expect(instance.roleCheckHandler).not.toBe(null);
	done();
};

describe("A websites controller", () => {
	it("defaults its constructor arguments", constructorTest);
});