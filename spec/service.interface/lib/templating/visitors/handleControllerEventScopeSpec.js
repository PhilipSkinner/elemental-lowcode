const handleControllerEventScope = require('../../../../../src/service.interface/lib/templating/visitors/handleControllerEventScope');

const applyTest = (done) => {
	const instance = handleControllerEventScope();

	instance.apply({
		view : {
			onclick : {}
		},
		data : {
			_controller : {
				identifier : 'my-controller'		
			}
		}
	}).then((definition) => {
		expect(definition).toEqual({
			view : [
				{
					onclick : {
						params : {
							_identifier : 'my-controller'
						}
					}
				}
			],
			data : {
				_controller : {
					identifier : 'my-controller'		
				}
			}
		});

		done();
	});
};

describe('A controller event scope handler', () => {
	it('can apply scope', applyTest);
});