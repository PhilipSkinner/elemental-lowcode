const
    jasmine 	= require('jasmine'),
    sinon 		= require('sinon'),
    handleLoops	= require('../../../../../src/service.interface/lib/templating/visitors/handleLoops');

const constructorTest = (done) => {
    const instance = handleLoops();
    expect(instance.dataResolver).not.toBe(null);
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

describe('A loop handler', () => {
    it('defaults its constructor arguments', constructorTest);
    it('renders loops', loopsTest);
});