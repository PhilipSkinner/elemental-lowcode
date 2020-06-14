const
	sinon 			= require("sinon"),
	typeValidator	= require("../../../kernel/lib/typeValidator");

const constructorTest = (done) => {
	const instance = typeValidator();
	expect(instance.ajv).not.toBe(null);
	expect(instance.path).not.toBe(null);
	expect(instance.fs).not.toBe(null);
	done();
};

describe("A type validator", () => {
	it("defaults its constructor arguments", constructorTest);
});