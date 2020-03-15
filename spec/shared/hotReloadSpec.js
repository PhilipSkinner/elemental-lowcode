const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	hotReload 		= require("../../shared/hotReload");

const constructorTest = (done) => {
	const instance = hotReload();
	expect(instance.chokidar).not.toBe(null);
	done();
};

describe("A hot reload provider", () => {
	it("defaults its constructor arguments", constructorTest);
});