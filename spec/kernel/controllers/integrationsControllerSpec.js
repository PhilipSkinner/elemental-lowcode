const
	sinon 			= require("sinon"),
	controller 		= require("../../../kernel/controllers/integrationsController");

const constructorTest = (done) => {
	const instance = controller();
	expect(instance.path).not.toBe(null);
	expect(instance.fileLister).not.toBe(null);
	expect(instance.roleCheckHandler).not.toBe(null);
	expect(instance.typeValidator).not.toBe(null);
	done();
};

describe("An integrations controller", () => {
	it("defaults its constructor arguments", constructorTest);
});