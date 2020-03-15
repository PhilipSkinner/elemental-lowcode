const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	certProvider 	= require("../../shared/certProvider");

const constructorTest = (done) => {
	const instance = certProvider();
	expect(instance.crypt).not.toBe(null);
	expect(instance.fs).not.toBe(null);
	expect(instance.path).not.toBe(null);
	done();
};

describe("A certificate provider", () => {
	it("defaults its constructor arguments", constructorTest);
});