const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	tokenHandler 	= require("../../shared/tokenHandler");

const constructorTest = (done) => {
	const instance = tokenHandler();
	expect(instance.jwt).not.toBe(null);
	done();
};

describe("A JWT token handler", () => {
	it("defaults its constructor arguments", constructorTest);
});