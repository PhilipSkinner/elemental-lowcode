const handleControllerScope = require('../../../../../src/service.interface/lib/templating/visitors/handleControllerScope');

const supportViewArray = (done) => {
	const instance = handleControllerScope();

	instance.apply({
		view : [{}],
		data : {}
	}).then((definition) => {
		expect(definition).toEqual({
			view : [{}],
			data : {}
		});

		done();
	});
};

const scopeApplyTest = (done) => {
	const instance = handleControllerScope();

	instance.apply({
		view : {
			_controller : {},
			_scope : {},
			delve : {
				_controller : {},
				_scope : {}
			}
		},
		data : {
			bag : {
				hello : 'world'
			}
		}
	}).then((definition) => {
		expect(definition).toEqual({
			view : [
				{
					_controller : {
						instance : {
							bag : {
								hello : 'world'
							}
						},						
					},
					_scope : {
						data : {
							bag : {
								hello : 'world'
							}
						}
					},
					delve : {
						_controller : {
							instance : {
								bag : {
									hello : 'world'
								}
							},						
						},
						_scope : {
							data : {
								bag : {
									hello : 'world'
								}
							}
						}
					}
				}
			],
			data : {
				bag : {
					hello : 'world'
				}
			}
		});

		done();
	});
};

const nullInstance = (done) => {
	const instance = handleControllerScope();

	instance.apply({
		view : {
			_controller : {},
			_scope : {},
			delve : {
				_controller : {},
				_scope : {}
			}
		},
		data : null
	}).then((definition) => {
		expect(definition).toEqual({
			view : [
				{
					_controller : {
						instance : {
							bag : {}
						},						
					},
					_scope : {
						data : {
							bag : {}
						}
					},
					delve : {
						_controller : {
							instance : {
								bag : {}
							},						
						},
						_scope : {
							data : {
								bag : {}
							}
						}
					}
				}
			],
			data : null
		});

		done();
	});
};

const weirdTag = (done) => {
	const instance = handleControllerScope();

	instance.apply({
		view : ['woot'],
		data : {}
	}).then((definition) => {
		expect(definition).toEqual({
			view : ['woot'],
			data : {}
		});

		done();
	});
};

const scopeApplySyncTest = (done) => {
	const instance = handleControllerScope();

	expect(instance.applySync({
		view : {
			_controller : {},
			_scope : {},
			delve : {
				_controller : {},
				_scope : {}
			}
		},
		data : {
			bag : {
				hello : 'world'
			}
		}
	})).toEqual({
		view : [
			{
				_controller : {
					instance : {
						bag : {
							hello : 'world'
						}
					},						
				},
				_scope : {
					data : {
						bag : {
							hello : 'world'
						}
					}
				},
				delve : {
					_controller : {
						instance : {
							bag : {
								hello : 'world'
							}
						},						
					},
					_scope : {
						data : {
							bag : {
								hello : 'world'
							}
						}
					}
				}
			}
		],
		data : {
			bag : {
				hello : 'world'
			}
		}
	});

	done();	
};

describe('A controller scope handler', () => {
	it('supports view arrays', supportViewArray);
	it('applies itself correctly', scopeApplyTest);
	it('handles null instance', nullInstance);	
	it('handles weird tags', weirdTag);
	it('applies itself sync', scopeApplySyncTest);
});