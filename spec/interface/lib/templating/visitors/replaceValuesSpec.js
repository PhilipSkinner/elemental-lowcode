const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	replaceValues	= require("../../../../../interface/lib/templating/visitors/replaceValues");

const constructorTest = (done) => {
	const instance = replaceValues();
	expect(instance.dataResolver).not.toBe(null);
	done();
};

const replacementTest = (done) => {
	const instance = replaceValues();
	instance.apply({
		view : [
			{
				hello : "$.world",
				repeat : "$.world",
				array : [
					{
						of : "$.ignored",
						value : "$.nested.value"
					}
				],
				obj : {
					of : "$.ignored",
					value : "$.nested.value",
					nested : "$.obj"
				},
				includedArr : "$.includedArr"
			},
			"ignore",
			[
				{
					another : "$.nested.value"
				}
			]
		],
		data : {
			world : "world",
			nested : {
				value : "value"
			},
			obj : {
				of : "$.ignored",
				value : "$.nested.value"
			},
			includedArr : [
				{
					hello : "$.world"
				},
				{
					hello : "$.world"
				}
			]
		}
	}).then((definition) => {
		expect(definition.view).toEqual([
			{
				hello : "world",
				repeat : "$.world",
				array : [
					{
						of : "$.ignored",
						value : "value"
					}
				],
				obj : {
					of : "$.ignored",
					value : "value",
					nested : {
						of : "$.ignored",
						value : "value",
					}
				},
				includedArr : [
					{
						hello : "world"
					},
					{
						hello : "world"
					}
				]
			},
			"ignore",
			[
				{
					another : "value"
				}
			]
		]);

		done();
	});
};

const syncReplacementTest = (done) => {
	const instance = replaceValues();
	expect(instance.applySync({
		view : [
			{
				hello : "$.world",
				repeat : "$.world",
				array : [
					{
						of : "$.ignored",
						value : "$.nested.value"
					}
				],
				obj : {
					of : "$.ignored",
					value : "$.nested.value",
					nested : "$.obj"
				},
				includedArr : "$.includedArr"
			},
			"ignore",
			[
				{
					another : "$.nested.value"
				}
			]
		],
		data : {
			world : "world",
			nested : {
				value : "value"
			},
			obj : {
				of : "$.ignored",
				value : "$.nested.value"
			},
			includedArr : [
				{
					hello : "$.world"
				},
				{
					hello : "$.world"
				}
			]
		}
	}).view).toEqual([
		{
			hello : "world",
			repeat : "$.world",
			array : [
				{
					of : "$.ignored",
					value : "value"
				}
			],
			obj : {
				of : "$.ignored",
				value : "value",
				nested : {
					of : "$.ignored",
					value : "value",
				}
			},
			includedArr : [
				{
					hello : "world"
				},
				{
					hello : "world"
				}
			]
		},
		"ignore",
		[
			{
				another : "value"
			}
		]
	]);

	done();
};

describe("A value substituter", () => {
	it("defaults its constructor arguments", constructorTest);
	it("replaces values", replacementTest);
	it("replaces values sync", syncReplacementTest);
});