const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	stringParser	= require("../../../integration/lib/stringParser");

const parseStringTest = (done) => {
	const instance = stringParser();

	let result = instance.parseString("$(hello) this is $(some.nested) data", {
		hello : "hello",
		some : {
			nested : "some nested"
		}
	});

	expect(result).toEqual("hello this is some nested data");

	result = instance.parseString("$(nullvalue)", {});

	expect(result).toEqual("$(nullvalue)");

	result = instance.parseString("pingu says $(multiple) $(multiple)", {
		multiple : "noot"
	});

	expect(result).toEqual("pingu says noot noot");

	done();
};

describe("A string parser", () => {
	it("can parse a string", parseStringTest);
});