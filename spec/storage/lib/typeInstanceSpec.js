const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	typeInstance	= require("../../../storage/lib/typeInstance");

const constructorTest = (done) => {
	const instance = typeInstance(null, null, { schema : { properties : {} } });
	expect(instance.uuid).not.toBe(null);
	expect(instance.ajv).not.toBe(null);
	expect(instance.roleCheckHandler).not.toBe(null);
	done();
};

describe("A storage types instance", () => {
	it("defaults its constructor arguments", constructorTest);
});