const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	fsStore 		= require("../../../../storage/lib/stores/fsStore");

const constructorTest = (done) => {
	const instance = fsStore();
	expect(instance.dir).not.toBe(null);
	expect(instance.path).not.toBe(null);
	expect(instance.fs).not.toBe(null);
	done();
};

describe("A file system storage service", () => {
	it("defaults its constructor arguments", constructorTest);
});