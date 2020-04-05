const defineScope = require('../../../../../interface/lib/templating/visitors/defineScope');

const defineScopeTest = (done) => {
	const instance = defineScope();

	instance.apply({
		view : [
			{
				children : [
					{
						thing : {

						}
					}
				]
			},
			{
				_scope : "doot"
			}
		]
	}).then((definition) => {
		expect(definition.view).toEqual([
			{
				_scope : {},
				children : [
					{
						_scope : {},
						thing : {
							_scope : {}
						}
					}
				]
			},
			{
				_scope : "doot"
			}
		]);

		done();
	});
};

describe("A scope defining visitor", () => {
	it("defines scope correctly", defineScopeTest);
});