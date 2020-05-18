const insertStandardScripts = require('../../../../../interface/lib/templating/visitors/insertStandardScripts');

const insertionTest = (done) => {
	const instance = insertStandardScripts();
	instance.apply({
		view : [
			{
				children : [
					{
						tag : "body"
					},
					{
						tag : "body",
						children : [
							"one"
						]
					}
				]
			}
		]
	}).then((definition) => {
		expect(definition.view).toEqual([
			{
				children : [
					{
						tag : "body",
						children : [
							{
								tag : "script",
								src : "/_static/js/axios.js"
							},
							{
								tag : "script",
								src : "/_static/js/diff.js"
							},
							{
								tag : "script",
								src : "/_static/js/clickEnhance.js"
							},
							{
								tag : "script",
								src : "/_static/js/formEnhance.js"
							}
						]
					},
					{
						tag : "body",
						children : [
							"one",
							{
								tag : "script",
								src : "/_static/js/axios.js"
							},
							{
								tag : "script",
								src : "/_static/js/diff.js"
							},
							{
								tag : "script",
								src : "/_static/js/clickEnhance.js"
							},
							{
								tag : "script",
								src : "/_static/js/formEnhance.js"
							}
						]
					}
				]
			}
		]);

		done();
	});
};

describe("A standard script insertion visitor", () => {
	it("inserts standard scripts", insertionTest);
});