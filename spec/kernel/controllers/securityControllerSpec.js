const
	sinon 			= require("sinon"),
	controller 		= require("../../../kernel/controllers/securityController");

const constructorTest = (done) => {
	const instance = controller(null, null, null, null, function() {}, null, null);
	expect(instance.fileLister).not.toBe(null);
	expect(instance.roleCheckHandler).not.toBe(null);
	expect(instance.db).not.toBe(null);
	expect(instance.bcrype).not.toBe(null);
	expect(instance.path).not.toBe(null);
	done();
};

describe("A security controller", () => {
	it("defaults its constructor arguments", constructorTest);
});