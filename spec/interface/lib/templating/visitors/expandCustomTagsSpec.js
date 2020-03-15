const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	expandCustomTags	= require("../../../../../interface/lib/templating/visitors/expandCustomTags");

const constructorTest = (done) => {
	const instance = expandCustomTags();
	expect(instance.replaceValues).not.toBe(null);
	done();
};

describe("A custom tag expander", () => {
	it("defaults its constructor arguments", constructorTest);
});