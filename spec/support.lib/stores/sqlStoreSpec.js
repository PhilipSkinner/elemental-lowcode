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
    },
    Op : {
        or  : 'or',
        and : 'and'
    }
};

const uuid = {
    main : () => {}
};

const model = {
    count           : () => {},
    findAndCountAll : () => {},
    destroy         : () => {},
    update          : () => {},
    create          : () => {},
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
        offset  : 0,
        include : []
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

const getResourcesRetryMechanism = (done) => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    //mark as not ready
    instance.isReady = false;

    //set the timeout
    instance.timeout = 10;
    instance.attempts = 3;

    instance.getResources('type', 1, 10).then((res) => {
        expect(res).toEqual(null);

        done();
    });
};

const getResourcesExceptionTest = (done) => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    //mark as ready
    instance.isReady = true;

    //model
    const modelMock = sinon.mock(model);
    modelMock.expects('findAndCountAll').once().withArgs({
        where   : {},
        order   : [],
        limit   : 10,
        offset  : 0,
        include : []
    }).returns(Promise.reject(new Error('oh dear')));
    instance.models.type = model;

    instance.getResources('type', 1, 10).catch((err) => {
        expect(err).toEqual(new Error('oh dear'));

        modelMock.verify();

        done();
    });
};

const getResourcesDefaultCounts = (done) => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    //mark as ready
    instance.isReady = true;

    //model
    const modelMock = sinon.mock(model);
    modelMock.expects('findAndCountAll').once().withArgs({
        where   : {},
        order   : [],
        limit   : 5,
        offset  : 0,
        include : []
    }).returns(Promise.resolve({
        rows : []
    }));
    instance.models.type = model;

    instance.getResources('type').then((res) => {
        expect(res).toEqual([]);

        modelMock.verify();

        done();
    });
};

const getResourcesFilters = (done) => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    //mark as ready
    instance.isReady = true;

    //model
    const modelMock = sinon.mock(model);
    modelMock.expects('findAndCountAll').once().withArgs({
        where   : {
            id : 12,
            or : [
                {
                    this : 'that'
                },
                {
                    that : 'this'
                }
            ],
            and : [
                {
                    this : 'that'
                },
                {
                    that : 'this'
                }
            ]
        },
        order   : [],
        limit   : 5,
        offset  : 0,
        include : []
    }).returns(Promise.resolve({
        rows : []
    }));
    instance.models.type = model;

    instance.getResources('type', 1, 5, [
        {
            path : '$.id',
            value : 12
        },
        {
            value : {
                operator : "or",
                fields : {
                    '$.this' : 'that',
                    '$.that' : 'this'
                }
            }
        },
        {
            value : {
                operator : "and",
                fields : {
                    '$.this' : 'that',
                    '$.that' : 'this'
                }
            }
        },
        {
            value : {
                operator : "and"
            }
        }
    ]).then((res) => {
        expect(res).toEqual([]);

        modelMock.verify();

        done();
    });
};

const getResourcesOrdering = (done) => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    //mark as ready
    instance.isReady = true;

    //model
    const modelMock = sinon.mock(model);
    modelMock.expects('findAndCountAll').once().withArgs({
        where   : {},
        order   : [
            [
                'id',
                'desc'
            ]
        ],
        limit   : 5,
        offset  : 0,
        include : []
    }).returns(Promise.resolve({
        rows : []
    }));
    instance.models.type = model;

    instance.getResources('type', 1, 5, [], [
        {
            path : '$.id',
            value : 'desc'
        }
    ]).then((res) => {
        expect(res).toEqual([]);

        modelMock.verify();

        done();
    });
};

const getResourceRetryMechanism = (done) => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    //mark as not ready
    instance.isReady = false;

    //set the timeout
    instance.timeout = 10;
    instance.attempts = 3;

    instance.getResource('type', 1).then((res) => {
        expect(res).toEqual(null);

        done();
    });
};

const getResourceInvalidId = (done) => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    //mark as not ready
    instance.isReady = true;

    instance.getResource('type', null).then((res) => {
        expect(res).toEqual(null);

        done();
    });
};

const getResourceNoResults = (done) => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    //mark as ready
    instance.isReady = true;

    //model
    const modelMock = sinon.mock(model);
    modelMock.expects('findAndCountAll').once().withArgs({
        where   : {
            id : 1234
        },
        order   : [],
        limit   : 1,
        offset  : 0,
        include : []
    }).returns(Promise.resolve({
        rows : []
    }));
    instance.models.type = model;

    instance.getResource('type', 1234).then((res) => {
        expect(res).toEqual(null);

        modelMock.verify();

        done();
    });
};

const getResourceTest = (done) => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    //mark as ready
    instance.isReady = true;

    //model
    const modelMock = sinon.mock(model);
    modelMock.expects('findAndCountAll').once().withArgs({
        where   : {
            id : 1234
        },
        order   : [],
        limit   : 1,
        offset  : 0,
        include : []
    }).returns(Promise.resolve({
        rows : [
            {
                _modelOptions : {
                    name : {
                        singular : 'type'
                    }
                },
                dataValues : {
                    id : 1234
                }
            }
        ]
    }));
    instance.models.type = model;

    instance.getResource('type', 1234).then((res) => {
        expect(res).toEqual({
            id : 1234
        });

        modelMock.verify();

        done();
    });
};

const deleteResourceRetryMechanism = (done) => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    //mark as not ready
    instance.isReady = false;

    //set the timeout
    instance.timeout = 10;
    instance.attempts = 3;

    instance.deleteResource('type', 1).then((res) => {
        expect(res).toEqual(null);

        done();
    });
};

const deleteResourceExceptionTest = (done) => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    //mark as ready
    instance.isReady = true;

    const modelMock = sinon.mock(model);
    modelMock.expects('destroy').once().withArgs({
        where : {
            id : 1
        }
    }).returns(Promise.reject(new Error('oh noes')));
    instance.models.type = model;

    instance.deleteResource('type', 1).catch((err) => {
        expect(err).toEqual(new Error('oh noes'));

        modelMock.verify();

        done();
    });
};

const deleteResourceTest = (done) => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    //mark as ready
    instance.isReady = true;

    const modelMock = sinon.mock(model);
    modelMock.expects('destroy').once().withArgs({
        where : {
            id : 1
        }
    }).returns(Promise.resolve());
    instance.models.type = model;

    instance.deleteResource('type', 1).then(() => {
        modelMock.verify();

        done();
    });
};

const updateResourceRetryMechanism = (done) => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    //mark as not ready
    instance.isReady = false;

    //set the timeout
    instance.timeout = 10;
    instance.attempts = 3;

    instance.updateResource('type', 1, {
        hello : 'world'
    }).then((res) => {
        expect(res).toEqual(null);

        done();
    });
};

const updateResourceExceptionTest = (done) => {
    const instance = sqlStore(null, {}, sequelize, uuid.main);

    //mark as ready
    instance.isReady = true;

    const modelMock = sinon.mock(model);
    modelMock.expects('findAndCountAll').once().withArgs({
        where : {
            id : 1
        },
        order : [],
        limit : 1,
        offset : 0,
        include : []
    }).returns(Promise.resolve({
        rows : [
            {
                _modelOptions : {
                    name : {
                        singular : 'type'
                    }
                },
                dataValues : {
                    id : 1
                }
            }
        ]
    }));
    modelMock.expects('update').once().withArgs({
        id : 1,
        hello : 'world'
    }, {
        where : {
            id : 1
        }
    }).returns(Promise.reject(new Error('oh dear')));

    instance.models.type = model;
    instance.tables.type = {
        hello : ''
    };

    instance.updateResource('type', 1, {
        hello : 'world'
    }).catch((err) => {
        expect(err).toEqual(new Error('oh dear'));

        modelMock.verify();

        done();
    });
};

const updateResourceTest = (done) => {
    const instance = sqlStore(null, {}, sequelize, uuid.main);

    //mark as ready
    instance.isReady = true;

    const modelMock = sinon.mock(model);
    modelMock.expects('findAndCountAll').once().withArgs({
        where : {
            id : 1
        },
        order : [],
        limit : 1,
        offset : 0,
        include : []
    }).returns(Promise.resolve({
        rows : [
            {
                _modelOptions : {
                    name : {
                        singular : 'type'
                    }
                },
                dataValues : {
                    id : 1
                }
            }
        ]
    }));
    modelMock.expects('update').once().withArgs({
        id : 1,
        hello : 'world'
    }, {
        where : {
            id : 1
        }
    }).returns(Promise.resolve());

    instance.models.type = model;
    instance.tables.type = {
        hello : ''
    };

    instance.updateResource('type', 1, {
        hello : 'world'
    }).then((res) => {
        expect(res).toEqual({
            id : 1,
            hello : 'world'
        });

        modelMock.verify();

        done();
    });
};

const updateResourceWithParent = (done) => {
    const instance = sqlStore(null, {}, sequelize, uuid.main);

    //mark as ready
    instance.isReady = true;

    const modelMock = sinon.mock(model);
    modelMock.expects('findAndCountAll').once().withArgs({
        where : {
            id : 1
        },
        order : [],
        limit : 1,
        offset : 0,
        include : []
    }).returns(Promise.resolve({
        rows : [
            {
                _modelOptions : {
                    name : {
                        singular : 'type'
                    }
                },
                dataValues : {
                    id : 1
                }
            }
        ]
    }));
    modelMock.expects('update').once().withArgs({
        id : 1,
        hello : 'world',
        parent : 'parent'
    }, {
        where : {
            id : 1
        }
    }).returns(Promise.resolve());

    instance.models.type = model;
    instance.tables.type = {
        hello : '',
        parent : ''
    };

    instance.updateResource('type', 1, {
        hello : 'world'
    }, 'parent').then((res) => {
        expect(res).toEqual({
            id : 1,
            hello : 'world',
            parent : 'parent'
        });

        modelMock.verify();

        done();
    });
};

const createResourceRetryMechanism = (done) => {
    const instance = sqlStore(null, {}, sequelize, uuid);

    //mark as not ready
    instance.isReady = false;

    //set the timeout
    instance.timeout = 10;
    instance.attempts = 3;

    instance.createResource('type', 1, {
        hello : 'world'
    }).then((res) => {
        expect(res).toEqual(null);

        done();
    });
};

const createResourceExceptionTest = (done) => {
    const uuidMock = sinon.mock(uuid);
    uuidMock.expects('main').once().returns('etag');

    const instance = sqlStore(null, {}, sequelize, uuid.main);

    //mark as ready
    instance.isReady = true;

    const modelMock = sinon.mock(model);
    modelMock.expects('findAndCountAll').once().withArgs({
        where : {
            id : 1
        },
        order : [],
        limit : 1,
        offset : 0,
        include : []
    }).returns(Promise.resolve({
        rows : []
    }));
    modelMock.expects('create').once().withArgs({
        id : 1,
        hello : 'world',
        etag : 'etag',
    }).returns(Promise.reject(new Error('oops')));

    instance.models.type = model;
    instance.tables.type = {
        hello : '',
        etag : ''
    };

    instance.createResource('type', 1, {
        hello : 'world'
    }).catch((err) => {
        expect(err).toEqual(new Error('oops'));

        uuidMock.verify();
        modelMock.verify();

        done();
    });
};

const createResourceHandleDuplication = (done) => {
    const uuidMock = sinon.mock(uuid);
    uuidMock.expects('main').once().returns('etag');

    const instance = sqlStore(null, {}, sequelize, uuid.main);

    //mark as ready
    instance.isReady = true;

    const modelMock = sinon.mock(model);
    modelMock.expects('findAndCountAll').once().withArgs({
        where : {
            id : 1
        },
        order : [],
        limit : 1,
        offset : 0,
        include : []
    }).returns(Promise.resolve({
        rows : []
    }));
    modelMock.expects('create').once().withArgs({
        id : 1,
        hello : 'world',
        etag : 'etag',
    }).returns(Promise.reject({
        original : {
            code : 'ER_DUP_ENTRY'
        }
    }));

    instance.models.type = model;
    instance.tables.type = {
        hello : '',
        etag : ''
    };

    instance.createResource('type', 1, {
        hello : 'world'
    }).catch((err) => {
        expect(err).toEqual(new Error('Resource already exists'));

        uuidMock.verify();
        modelMock.verify();

        done();
    });
};

const createResourceHandleDuplicationAlternative = (done) => {
    const uuidMock = sinon.mock(uuid);
    uuidMock.expects('main').once().returns('etag');

    const instance = sqlStore(null, {}, sequelize, uuid.main);

    //mark as ready
    instance.isReady = true;

    const modelMock = sinon.mock(model);
    modelMock.expects('findAndCountAll').once().withArgs({
        where : {
            id : 1
        },
        order : [],
        limit : 1,
        offset : 0,
        include : []
    }).returns(Promise.resolve({
        rows : []
    }));
    modelMock.expects('create').once().withArgs({
        id : 1,
        hello : 'world',
        etag : 'etag',
    }).returns(Promise.reject({
        original : {
            code : 'ER_DUP_ENTRY_WHAT',
        },
        fields : [
            "id"
        ]
    }));

    instance.models.type = model;
    instance.tables.type = {
        hello : '',
        etag : ''
    };

    instance.createResource('type', 1, {
        hello : 'world'
    }).catch((err) => {
        expect(err).toEqual(new Error('Resource already exists'));

        uuidMock.verify();
        modelMock.verify();

        done();
    });
};

const createResourceWithIdTest = (done) => {
    const uuidMock = sinon.mock(uuid);
    uuidMock.expects('main').once().returns('etag');

    const instance = sqlStore(null, {}, sequelize, uuid.main);

    //mark as ready
    instance.isReady = true;

    const modelMock = sinon.mock(model);
    modelMock.expects('findAndCountAll').once().withArgs({
        where : {
            id : 1
        },
        order : [],
        limit : 1,
        offset : 0,
        include : []
    }).returns(Promise.resolve({
        rows : []
    }));
    modelMock.expects('create').once().withArgs({
        id : 1,
        hello : 'world',
        etag : 'etag',
    }).returns(Promise.resolve({
        dataValues : {
            id : 1,
            hello : 'world',
            etag : 'etag'
        }
    }));

    instance.models.type = model;
    instance.tables.type = {
        hello : '',
        etag : ''
    };

    instance.createResource('type', 1, {
        hello : 'world'
    }).then((res) => {
        expect(res).toEqual({
            id : 1,
            hello : 'world',
            etag : 'etag'
        });

        uuidMock.verify();
        modelMock.verify();

        done();
    });
};

const createResourceWithoutIdTest = (done) => {
    const uuidMock = sinon.mock(uuid);
    uuidMock.expects('main').once().returns('id');
    uuidMock.expects('main').once().returns('etag');

    const instance = sqlStore(null, {}, sequelize, uuid.main);

    //mark as ready
    instance.isReady = true;

    const modelMock = sinon.mock(model);
    modelMock.expects('create').once().withArgs({
        id : 'id',
        hello : 'world',
        etag : 'etag',
    }).returns(Promise.resolve({
        dataValues : {
            id : 'id',
            hello : 'world',
            etag : 'etag'
        }
    }));

    instance.models.type = model;
    instance.tables.type = {
        hello : '',
        etag : '',
        id : ''
    };

    instance.createResource('type', null, {
        hello : 'world',
        ignore : ['me']
    }).then((res) => {
        expect(res).toEqual({
            id : 'id',
            hello : 'world',
            etag : 'etag'
        });

        uuidMock.verify();
        modelMock.verify();

        done();
    });
};

const createComplexChildren = (done) => {
    const uuidMock = sinon.mock(uuid);
    uuidMock.expects('main').once().returns('id');
    uuidMock.expects('main').once().returns('etag');
    uuidMock.expects('main').once().returns('child_one');
    uuidMock.expects('main').once().returns('etag_one');
    uuidMock.expects('main').once().returns('child_two');
    uuidMock.expects('main').once().returns('etag_two');

    const instance = sqlStore(null, {}, sequelize, uuid.main);

    //mark as ready
    instance.isReady = true;

    const modelMock = sinon.mock(model);
    modelMock.expects('create').once().withArgs({
        id : 'id',
        hello : 'world',
        etag : 'etag',
    }).returns(Promise.resolve({
        dataValues : {
            id : 'id',
            hello : 'world',
            etag : 'etag'
        }
    }));
    modelMock.expects('destroy').once().withArgs({
        where : {
            parent : 'id'
        }
    }).returns(Promise.resolve());
    modelMock.expects('create').once().withArgs({
        id : 'child_one',
        etag : 'etag_one',
        value : 'yes',
        parent : 'id'
    }).returns(Promise.resolve());
    modelMock.expects('create').once().withArgs({
        id : 'child_two',
        etag : 'etag_two',
        value : 'sir',
        parent : 'id'
    }).returns(Promise.resolve());

    instance.models.type = model;
    instance.models.type_children = model;
    instance.tables.type = {
        hello : '',
        etag : '',
        id : ''
    };
    instance.tables.type_children = {
        id : '',
        etag : '',
        value : '',
        parent : '',
    }
    instance.columnTableLookups['type@@children'] = 'type_children';

    instance.createResource('type', null, {
        hello : 'world',
        children : [
            'yes',
            'sir'
        ]
    }).then((res) => {
        expect(res).toEqual({
            id : 'id',
            hello : 'world',
            etag : 'etag'
        });

        uuidMock.verify();
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

    describe('can get resources', () => {
        it('handling retries', getResourcesRetryMechanism);
        it('handles exceptions', getResourcesExceptionTest);
        it('handles default counts', getResourcesDefaultCounts);
        it('applies filters correctly', getResourcesFilters);
        it('handles ordering', getResourcesOrdering);
    });

    describe('can get a resource', () => {
        it('handling retries', getResourceRetryMechanism);
        it('handling invalid ids', getResourceInvalidId);
        it('handling no results', getResourceNoResults);
        it('correctly', getResourceTest);
    });

    describe('can delete a resource', () => {
        it('handling retries', deleteResourceRetryMechanism);
        it('handling exceptions', deleteResourceExceptionTest);
        it('correctly', deleteResourceTest);
    });

    describe('can update a resource', () => {
        it('handling retries', updateResourceRetryMechanism);
        it('handling exceptions', updateResourceExceptionTest);
        it('correctly', updateResourceTest);
        it('with a parent', updateResourceWithParent);
    });

    describe('can create a resource', () => {
        it('handling retries', createResourceRetryMechanism);
        it('handles exceptions', createResourceExceptionTest);
        it('handles duplication', createResourceHandleDuplication);
        it('handles duplication alternative', createResourceHandleDuplicationAlternative);
        it('correctly with id', createResourceWithIdTest);
        it('correctly without id', createResourceWithoutIdTest);
        it('with complex children', createComplexChildren);
    });
});