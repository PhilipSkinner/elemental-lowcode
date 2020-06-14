const
	sinon 			= require("sinon"),
	fileLister 	= require("../../../kernel/lib/fileLister");

const constructorTest = (done) => {
	const instance = fileLister();
	expect(instance.path).not.toBe(null);
	expect(instance.fs).not.toBe(null);
	expect(instance.glob).not.toBe(null);
	expect(instance.mkdirp).not.toBe(null);
	expect(instance.tar).not.toBe(null);
	done();
};

describe("A file lister", () => {
	it("defaults its constructor arguments", constructorTest);
});