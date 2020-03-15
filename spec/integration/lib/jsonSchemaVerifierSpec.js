const
	jasmine 			= require("jasmine"),
	sinon 				= require("sinon"),
	jsonSchemaVerifier	= require("../../../integration/lib/jsonSchemaVerifier");

const constructorTest = (done) => {
	const instance = jsonSchemaVerifier();
	expect(instance.ajv).not.toBe(null);
	done();
};

describe("A JSON schema verifier", () => {
	it("defaults its constructor arguments", constructorTest);
});