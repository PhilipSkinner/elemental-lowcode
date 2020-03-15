const
	jasmine 	= require("jasmine"),
	sinon 		= require("sinon"),
	render 		= require("../../../../interface/lib/templating/render");

const constructorTest = (done) => {
	const instance = render();
	expect(instance.fs).not.toBe(null);
	expect(instance.path).not.toBe(null);
	expect(instance.preProcessor).not.toBe(null);
	done();
};

describe("A template renderer", () => {
	it("defaults its constructor arguments", constructorTest);
});