const arrayWrapper = require('../../../../../interface/lib/templating/visitors/arrayWrapper');

const setAsArray = (done) => {
	const instance = arrayWrapper();
	instance.apply({
		view : "hello"
	}).then((definition) => {
		expect(definition).toEqual({
			view : ["hello"]
		});

		done();
	});
};

const ignoresTest = (done) => {
	const instance = arrayWrapper();
	instance.apply({
		view : ["already an array"]
	}).then((definition) => {
		expect(definition).toEqual({
			view : ["already an array"]
		});

		done();
	});
};

describe("An array wrapping visitor", () => {
	it("sets the view to be an array if it isn't", setAsArray);
	it("ignores the view if its already an array", ignoresTest);
});