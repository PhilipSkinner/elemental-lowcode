const
    sinon     = require('sinon'),
    sqlStore  = require('../../../src/support.lib/stores/sqlStore');

const sequelize = {
    BOOLEAN : 1,
    INTEGER : 2,
    DECIMAL : 3,
    DATE    : 4,
    TEXT    : 5,
    UUID    : 6,
    STRING  : () => {
        return 6;
    }
};

const uuid = {

};

const model = {
    count : () => {},
    findAndCountAll : () => {},
};

const determineBooleansTest = () => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    expect(instance.determineType('boolean')).toEqual(sequelize.BOOLEAN);
};

const determineIntegersTest = () => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    expect(instance.determineType('integer')).toEqual(sequelize.INTEGER);
};

const determineNumbersTest = () => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    expect(instance.determineType('number')).toEqual(sequelize.DECIMAL);
};

const determineDecimalsTest = () => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    expect(instance.determineType('decimal')).toEqual(sequelize.DECIMAL);
};

const determineDateTimeTest = () => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    expect(instance.determineType('string', 'date-time')).toEqual(sequelize.DATE);
};

const determineDefaultTest = () => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    expect(instance.determineType('woot')).toEqual(sequelize.TEXT);
};

const determineTablesNestedSchemaTest = () => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    expect(instance.determineTables('doot', {
        type : 'object',
        properties : {
            noot : {
                type : 'object',
                properties : {
                    name : {
                        type : 'string'
                    }
                }
            },
            doot : {
                type : 'array',
                items : {
                    type : 'object',
                    properties : {
                        id : {
                            type : 'string'
                        },
                        name : {
                            type : 'string'
                        }
                    }
                }
            },
            woot : {
                type : 'array',
                items : {
                    type : 'number'
                }
            },
            loot : {
                type : 'string'
            }
        }
    }, {}, '', '')).toEqual({
        doot : {
            id : {
                primaryKey  : true,
                type        : 6,
                allowNull   : false,
            },
            etag : {
                type        : 6,
                allowNull   : false,
            },
            loot : {
                type : 5
            }
        },
        doot_noot : {
            id : {
                primaryKey  : true,
                type        : 6,
                allowNull   : false,
            },
            parent : {
                type        : 6,
                allowNull   : true,
                references  : {
                    model   : 'doot',
                    key     : 'id'
                }
            },
            etag : {
                type        : 6,
                allowNull   : false,
            },
            name : {
                type : 5
            }
        },
        doot_doot : {
            id : {
                primaryKey  : true,
                type        : 6,
                allowNull   : false,
            },
            parent : {
                type        : 6,
                allowNull   : true,
                references  : {
                    model   : 'doot',
                    key     : 'id'
                }
            },
            etag : {
                type        : 6,
                allowNull   : false,
            },
            name : {
                type : 5
            }
        },
        doot_woot : {
            id : {
                primaryKey  : true,
                type        : 6,
                allowNull   : false,
            },
            parent : {
                type        : 6,
                allowNull   : true,
                references  : {
                    model   : 'doot',
                    key     : 'id'
                }
            },
            etag : {
                type        : 6,
                allowNull   : false,
            },
            value : {
                type        : 3,
                allowNull   : false
            }
        }
    });
};

const getDetailsRetryMechanism = (done) => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    //mark as not ready
    instance.isReady = false;

    //set the timeout
    instance.timeout = 10;
    instance.attempts = 3;

    instance.getDetails('type', null).then((res) => {
        expect(res).toEqual(null);

        done();
    });
};

const getDetailsNoParent = (done) => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    //mark as ready
    instance.isReady = true;

    //setup model
    const modelMock = sinon.mock(model);
    modelMock.expects('count').once().withArgs({
        where : []
    }).returns(Promise.resolve('alot'));

    instance.models = {
        type : model
    };

    instance.getDetails('type', null).then((res) => {
        expect(res).toEqual({
            count : 'alot'
        });

        modelMock.verify();

        done();
    });
};

const getDetailsWithParent = (done) => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    //mark as ready
    instance.isReady = true;

    //setup model
    const modelMock = sinon.mock(model);
    modelMock.expects('count').once().withArgs({
        where : [
            {
                parent : 'daddy'
            }
        ]
    }).returns(Promise.resolve('alot'));

    instance.models = {
        type : model
    };

    instance.getDetails('type', 'daddy').then((res) => {
        expect(res).toEqual({
            count : 'alot'
        });

        modelMock.verify();

        done();
    });
};

const convertReturnNoValues = (done) => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    instance.convertToReturnValue({}, 'name').then((result) => {
        expect(result).toEqual(null);

        done();
    });
};

const convertReturnDataValues = (done) => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    instance.convertToReturnValue({
        _modelOptions : {
            name : {
                singular : 'singular_name'
            }
        },
        dataValues : {
            singular_name_array     : ["something","here"],
            name                    : 'trevor'
        }
    }, 'name').then((result) => {
        expect(result).toEqual({
            array : ["something", "here"],
            name : 'trevor'
        });

        done();
    });
};

const convertReturnDataSimpleChildren = (done) => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    //setup the simple tables
    instance.simpleTables = {
        'name' : {
            children : [
                'doot',
                'woot'
            ]
        }
    };

    //setup model
    const modelMock = sinon.mock(model);
    modelMock.expects('findAndCountAll').twice().withArgs({
        where   : {
            parent : '1234'
        },
        order   : [],
        limit   : 9999,
        offset  : 0
    }).returns(Promise.resolve({
        rows : [
            {
                _modelOptions : {
                    name : {
                        singular : 'bloot'
                    }
                },
                dataValues :{
                    value : 1
                }
            },
            {
                _modelOptions : {
                    name : {
                        singular : 'bloot'
                    }
                },
                dataValues : {
                    value : 2
                }
            }
        ]
    }));

    instance.models = {
        doot : model,
        woot : model
    };
    instance.columnTableLookups.doot = 'doot';
    instance.columnTableLookups.woot = 'woot';

    instance.convertToReturnValue({
        _modelOptions : {
            name : {
                singular : 'singular_name'
            }
        },
        dataValues : {
            id : '1234'
        }
    }, 'name').then((result) => {
        expect(result).toEqual({
            id      : '1234',
            doot    : [1, 2],
            woot    : [1, 2]
        });

        modelMock.verify();

        done();
    });
};

describe('A sql store', () => {
    describe('determine type', () => {
        it('can determine booleans', determineBooleansTest);
        it('can determine integers', determineIntegersTest);
        it('can determine numbers', determineNumbersTest);
        it('can determine decimals', determineDecimalsTest);
        it('can determine date times', determineDateTimeTest);
        it('defaults to text', determineDefaultTest);
    });

    describe('can determine tables', () => {
        it('with nested schemas', determineTablesNestedSchemaTest);
    });

    describe('can get details', () => {
        it('handling retries', getDetailsRetryMechanism);
        it('without parents', getDetailsNoParent);
        it('with parents', getDetailsWithParent);
    });

    describe('can convert to return value', () => {
        it('handling no result/values', convertReturnNoValues);
        it('handling data values', convertReturnDataValues);
        it('handling simple children relationships', convertReturnDataSimpleChildren);
    });
});