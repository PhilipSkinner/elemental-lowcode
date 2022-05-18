const conditionals = require('../../../../../src/service.interface/lib/templating/visitors/conditionals');

const conditionalsTest = (done) => {
    const instance = conditionals();
    instance.apply({
        view : [
            {
                _scope: {
                    if : []
                },
                children : [
                    {
                        thing : {
                            if : [
                                {
                                    statement : 'false',
                                    logicalOperator : 'or'
                                },
                                {
                                    statement : 'true',
                                    logicalOperator : 'or'
                                }
                            ]
                        },
                        if : [
                            {
                                statement : 'false',
                                logicalOperator : 'and'	
                            },
                            {
                                statement : 'true',
                                logicalOperator : 'and'
                            }
                        ]
                    },
                    [
                        {
                            if : {
                                statement : 'woot',
                                logicalOperator : 'and'	
                            }
                        }
                    ],
                    {
                        if : {
                            statement : 'true',
                            logicalOperator : 'unknown'
                        }
                    }
                ]
            }
        ]
    }).then((definition) => {
        expect(definition.view).toEqual([
            {
                _scope: {
                    if : []
                },
                children : [
                    {
                        thing : {
                            if : [
                                {
                                    statement : 'false',
                                    logicalOperator : 'or'
                                },
                                {
                                    statement : 'true',
                                    logicalOperator : 'or'
                                }
                            ]
                        },
                        __display : false,
                        if : [
                            {
                                statement : 'false',
                                logicalOperator : 'and'	
                            },
                            {
                                statement : 'true',
                                logicalOperator : 'and'
                            }
                        ]
                    },
                    [
                        {
                            __display : false,
                            if : {
                                statement : 'woot',
                                logicalOperator : 'and'	
                            }
                        }
                    ],
                    {
                        __display : false,
                        if : {
                            statement : 'true',
                            logicalOperator : 'unknown'
                        }
                    }
                ]
            }
        ]);

        done();
    });
};

describe('A conditional evaluating visitor', () => {
    it('evalues conditionals correctly', conditionalsTest);
});