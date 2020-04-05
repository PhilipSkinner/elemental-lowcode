const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	expandCustomTags	= require("../../../../../interface/lib/templating/visitors/expandCustomTags");

const replaceValues = {
	applySync : () => {}
};

const constructorTest = (done) => {
	const instance = expandCustomTags();
	expect(instance.replaceValues).not.toBe(null);
	done();
};

const expansionTest = (done) => {
	const replaceMock = sinon.mock(replaceValues);
	replaceMock.expects('applySync').once().withArgs({
		view : [
			{
				hello : "world",
				if : "this"
			}
		],
		data : {
			tag : "custom",
			if : "this"
		}
	}).returns({
		view : [
			{
				my : "value",
				if : "this"
			}
		]
	});
	replaceMock.expects('applySync').once().withArgs({
		view : [
			{
				prop : "$.items",
				repeat : "yes please",
			}
		],
		data : {
			tag : "expander",
			repeat : "yes please",
			items : [
				"one",
				"two"
			]
		}
	}).returns({
		view : [
			{
				repeat : "yes please",
				prop : [
					"one",
					"two"
				]
			}
		]
	});

	const instance = expandCustomTags(replaceValues);
	instance.setTags({
		custom : {
			definition : {
				hello : "world"
			}
		},
		expander : {
			definition : {
				prop : "$.items"
			}
		}
	});
	instance.apply({
		view : [
			{
				tag : "div",
				children : [
					{
						tag : "b"
					},
					{
						tag : "custom",
						if : "this"
					},
					{
						repeat : "yes please",
						tag : "expander",
						items : [
							"one",
							"two"
						]
					}
				]
			}
		]
	}).then((definition) => {
		expect(definition.view).toEqual([
			{
				tag : "div",
				children : [
					{
						tag : "b"
					},
					{
						my : "value",
						if : "this"
					},
					{
						repeat : "yes please",
						prop : [
							"one",
							"two"
						]
					}
				]
			}
		]);

		replaceMock.verify();

		done();
	});
};

describe("A custom tag expander", () => {
	it("defaults its constructor arguments", constructorTest);
	it("can expand custom tags", expansionTest);
});