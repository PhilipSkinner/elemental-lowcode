const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	expandCustomTags	= require("../../../../../interface/lib/templating/visitors/expandCustomTags");

const replaceValues = {
	applySync : () => {}
};

const handleLoops = {
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
				tag : "custom",
				if : "this"
			}
		],
		data : {}
	}).returns({
		view : [
			{
				tag : "custom",
				if : "this"
			}
		]
	});
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
				tag : "expander",
				repeat : "yes please",
				items : [
					"one",
					"two"
				]
			}
		],
		data : {}
	}).returns({
		view : [
			{
				tag : "expander",
				repeat : "yes please",
				items : [
					"one",
					"two"
				]
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

	const loopsMock = sinon.mock(handleLoops);
	loopsMock.expects('applySync').once().withArgs({
		view : [
			{
				my : "value",
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
	loopsMock.expects('applySync').once().withArgs({
		view : [
			{
				repeat : "yes please",
				prop : [
					"one",
					"two"
				]
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
				],
				children : [
					{
						"item" : "one"
					},
					{
						"item" : "two"
					}
				]
			}
		]
	});

	const instance = expandCustomTags(replaceValues, handleLoops);
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
						if : "this",
						_controller : undefined
					},
					{
						repeat : "yes please",
						_controller : undefined,
						prop : [
							"one",
							"two"
						],
						children : [
							{
								"item" : "one"
							},
							{
								"item" : "two"
							}
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