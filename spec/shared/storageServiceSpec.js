const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	storageService 	= require("../../shared/storageService");

const constructorTest = (done) => {
	const instance = storageService();
	expect(instance.request).not.toBe(null);
	done();
};

describe("A storage service client", () => {
	it("defaults its constructor arguments", constructorTest);
});