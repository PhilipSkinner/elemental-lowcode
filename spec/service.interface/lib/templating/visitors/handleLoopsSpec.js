const
    jasmine 	= require('jasmine'),
    sinon 		= require('sinon'),
    handleLoops	= require('../../../../../src/service.interface/lib/templating/visitors/handleLoops');

const constructorTest = (done) => {
    let instance = handleLoops();
    expect(instance.dataResolver).not.toBe(null);

    instance = handleLoops('hello');
    expect(instance.dataResolver).toEqual('hello');

    done();
};

const loopsTest = (done) => {
    const instance = handleLoops();
    instance.apply({
        view : [
            {
                tag : 'div',
                repeat : '$.item in $.bag.items',
                text : '$.item',
                count : '$._index',
                _scope : {

                }
            },
            'ignore',
            {
                tag : 'div',
                _scope : {},
                children : [
                    {
                        tag : 'div',
                        repeat : '$.item in $.bag.items',
                        text : '$.item',
                        count : '$._index',
                        _scope : {

                        }
                    }
                ]
            }
        ],
        data : {
            bag : {
                items : ['one', 'two']
            }
        }
    }).then((definition) => {
        expect(definition.view).toEqual([
            [
                {
                    tag : 'div',
                    text : '$.item',
                    count : '$._index',
                    _scope : {
                        data : {
                            item : 'one',
                            _index : 0
                        }
                    }
                },
                {
                    tag : 'div',
                    text : '$.item',
                    count : '$._index',
                    _scope : {
                        data : {
                            item : 'two',
                            _index : 1
                        }
                    }
                }
            ],
            'ignore',
            {
                tag : 'div',
                _scope : {},
                children : [
                    [
                        {
                            tag : 'div',
                            text : '$.item',
                            count : '$._index',
                            _scope : {
                                data : {
                                    item : 'one',
                                    _index : 0
                                }
                            }
                        },
                        {
                            tag : 'div',
                            text : '$.item',
                            count : '$._index',
                            _scope : {
                                data : {
                                    item : 'two',
                                    _index : 1
                                }
                            }
                        }
                    ]
                ]
            }
        ]);

        done();
    });
};

const undefinedVariablesTest = (done) => {
    const instance = handleLoops();
    instance.apply({
        view : [
            {
                tag : 'div',
                repeat : '$.item in $.bag.items',
                text : '$.item',
                count : '$._index',                
            }            
        ],
        data : null
    }).then((definition) => {        
        expect(definition.view).toEqual([            
            {
                tag : 'div',
                repeat : '$.item in $.bag.items',
                text : '$.item',
                count : '$._index',                
            }                
        ]);

        done();
    });
};

const stringVariablesTest = (done) => {
    const instance = handleLoops();
    instance.apply({
        view : [
            {
                tag : 'div',
                repeat : '$.item in $.bag.items',
                text : '$.item',
                count : '$._index',
                _scope : {

                }
            }            
        ],
        data : {
            bag : {  
                items : 'hello'              
            }
        }
    }).then((definition) => {        
        expect(definition.view).toEqual([            
            {
                tag : 'div',
                repeat : '$.item in hello',
                text : '$.item',
                count : '$._index',
                _scope : {

                }
            }                
        ]);

        done();
    });
};

const numberVariablesTest = (done) => {
    const instance = handleLoops();
    instance.apply({
        view : [
            {
                tag : 'div',
                repeat : '$.item in $.bag.items',
                text : '$.item',
                count : '$._index',
                _scope : {

                }
            }            
        ],
        data : {
            bag : {  
                items : 2          
            }
        }
    }).then((definition) => {        
        expect(definition.view).toEqual([            
            [
                {
                    tag : 'div',
                    text : '$.item',
                    count : '$._index',
                    _scope : {
                        data : {
                            item : 1,
                            _index : 0
                        }
                    }
                },
                {
                    tag : 'div',
                    text : '$.item',
                    count : '$._index',
                    _scope : {
                        data : {
                            item : 2,
                            _index : 1
                        }
                    }
                }               
            ]
        ]);

        done();
    });
};

const controllerTest = (done) => {
    const instance = handleLoops();
    instance.apply({
        view : [
            {
                tag : 'div',
                repeat : '$.item in $.bag.items',
                text : '$.item',
                count : '$._index',
                _scope : {

                },
                _controller : {

                }
            }            
        ],
        data : {
            bag : {  
                items : 1   
            }
        }
    }).then((definition) => {        
        expect(definition.view).toEqual([            
            [
                {
                    tag : 'div',
                    text : '$.item',
                    count : '$._index',
                    _scope : {
                        data : {
                            item : 1,
                            _index : 0
                        }
                    },
                    _controller : {}
                }               
            ]
        ]);

        done();
    });
};

const syncTest = (done) => {
    const instance = handleLoops();
    expect(instance.applySync({
        view : [
            {
                tag : 'div',
                repeat : '$.item in $.bag.items',
                text : '$.item',
                count : '$._index',
                _scope : {

                },
                _controller : {

                }
            }            
        ],
        data : {
            bag : {  
                items : 1   
            }
        }
    }).view).toEqual([            
        [
            {
                tag : 'div',
                text : '$.item',
                count : '$._index',
                _scope : {
                    data : {
                        item : 1,
                        _index : 0
                    }
                },
                _controller : {}
            }               
        ]
    ]);

    done();
};

describe('A loop handler', () => {
    it('defaults its constructor arguments', constructorTest);
    it('renders loops', loopsTest);
    it('handles undefined variables', undefinedVariablesTest);
    it('handles string variables', stringVariablesTest);
    it('handles number variables', numberVariablesTest);
    it('handles controllers', controllerTest);
    it('can be applied synchronously', syncTest);
});