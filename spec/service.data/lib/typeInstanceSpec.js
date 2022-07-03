const
    jasmine 		= require('jasmine'),
    sinon 			= require('sinon'),
    typeInstance	= require('../../../src/service.data/lib/typeInstance');

const store = {
    getResource : () => {},
    getResources : () => {},
    getDetails : () => {},
    deleteResource : () => {},
    createResource : () => {},
    updateResource : () => {},
};

const app = {
    get : () => {},
    post : () => {},
    put : () => {},
    patch : () => {},
    delete : () => {},
};

const uuid = {
    main : () => {}
};

const ajv = {
    compile : () => {},
    validate : () => {}
};

const securityHandler = {
    enforce : () => {}
};

const jsonpath = () => {

};

const hostnameResolver = () => {

};

const constructorTest = (done) => {
    const instance = typeInstance(null, null, { schema : { properties : {} } });
    expect(instance.uuid).not.toBe(null);
    expect(instance.ajv).not.toBe(null);
    expect(instance.securityHandler).not.toBe(null);
    done();
};

const determineIdentifiersTest = () => {
    const instance = typeInstance(store, app, {
        schema : {
            properties : {}
        }
    }, uuid, ajv, securityHandler, jsonpath, hostnameResolver);

    expect(instance.determineIdentifiers({
        path : '/parent/1/child/2/list',
        params : {
            parent    : 1,
            child     : 2
        }
    })).toEqual([
        {
            type        : 'parent',
            identifier  : '1'
        },
        {
            type        : 'parent_child',
            identifier  : '2'
        },
        {
            type        : 'parent_child_list',
            identifier  : null
        }
    ]);
};

const determineIdentifiersEmptyPathTest = () => {
    const instance = typeInstance(store, app, {
        schema : {
            properties : {}
        }
    }, uuid, ajv, securityHandler, jsonpath, hostnameResolver);

    expect(instance.determineIdentifiers({
        path : '/'
    })).toEqual([]);
};

const getListNotFoundTest = (done) => {
    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent', '1').returns(Promise.resolve(null));

    const instance = typeInstance(store, app, {
        schema : {
            properties : {}
        }
    }, uuid, ajv, securityHandler, jsonpath, hostnameResolver);

    const req = {
        path : '/parent/1/list',
        params : {
            parent    : 1
        }
    };

    const res = {
        status : (code) => {
            expect(code).toEqual(404);
            return res;
        },
        json : (data) => {

        },
        end : () => {
            storeMock.verify();

            done();
        }
    };

    instance.getHandler(req, res);
};

const getListParentFoundTest = (done) => {
    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent', '1').returns(Promise.resolve('the-parent'));
    storeMock.expects('getResources').once().withArgs('parent_list', undefined, undefined, [{
        path : '$.parent',
        value : '1'
    }], []).returns(Promise.resolve({
        hello : 'world'
    }));

    const instance = typeInstance(store, app, {
        schema : {
            properties : {}
        }
    }, uuid, ajv, securityHandler, jsonpath, hostnameResolver);

    const req = {
        path : '/parent/1/list',
        params : {
            parent    : 1
        }
    };

    const res = {
        json : (data) => {
            expect(data).toEqual({
                hello : 'world'
            })
        },
        end : () => {
            storeMock.verify();

            done();
        }
    };

    instance.getHandler(req, res);
};


const getListErrorTest = (done) => {
    const storeMock = sinon.mock(store);
    storeMock.expects('getResources').once().withArgs('parent', undefined, undefined, [], []).returns(Promise.reject(new Error('not today')));

    const instance = typeInstance(store, app, {
        schema : {
            properties : {}
        }
    }, uuid, ajv, securityHandler, jsonpath, hostnameResolver);

    const req = {
        path : '/parent'
    };

    const res = {
        status : (code) => {
            expect(code).toEqual(500);
            return res;
        },
        json : (data) => {
            expect(data).toEqual({
                errors : ['Error: not today']
            });
            return res;
        },
        end : () => {
            storeMock.verify();

            done();
        }
    };

    instance.getHandler(req, res);
};

const getListFilterTest = (done) => {
    const storeMock = sinon.mock(store);
    storeMock.expects('getResources').once().withArgs('parent', undefined, undefined, [{
        path : 'this_field',
        value : 'yes'
    }], []).returns(Promise.resolve({
        hello : 'world'
    }));

    const instance = typeInstance(store, app, {
        schema : {
            properties : {}
        }
    }, uuid, ajv, securityHandler, jsonpath, hostnameResolver);

    const req = {
        path : '/parent',
        query : {
            'filter_this_field' : 'yes'
        }
    };

    const res = {
        json : (data) => {
            expect(data).toEqual({
                hello : 'world'
            })
        },
        end : () => {
            storeMock.verify();

            done();
        }
    };

    instance.getHandler(req, res);
};

const getListOrderTest = (done) => {
    const storeMock = sinon.mock(store);
    storeMock.expects('getResources').once().withArgs('parent', undefined, undefined, [], [{
        path : 'this_field',
        value : 'yes'
    }]).returns(Promise.resolve({
        hello : 'world'
    }));

    const instance = typeInstance(store, app, {
        schema : {
            properties : {}
        }
    }, uuid, ajv, securityHandler, jsonpath, hostnameResolver);

    const req = {
        path : '/parent',
        query : {
            'order_this_field' : 'yes'
        }
    };

    const res = {
        json : (data) => {
            expect(data).toEqual({
                hello : 'world'
            })
        },
        end : () => {
            storeMock.verify();

            done();
        }
    };

    instance.getHandler(req, res);
};

const getDetailsNotFoundTest = (done) => {
    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent', '1').returns(Promise.resolve(null));

    const instance = typeInstance(store, app, {
        schema : {
            properties : {}
        }
    }, uuid, ajv, securityHandler, jsonpath, hostnameResolver);

    const req = {
        path : '/parent/1/children/.details',
        params : {
            parent : 1
        }
    };

    const res = {
        status : (code) => {
            expect(code).toEqual(404);
            return res;
        },
        end : () => {
            storeMock.verify();

            done();
        }
    };

    instance.getDetailsHandler(req, res);
};

const getDetailsParentFoundTest = (done) => {
    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent', '1').returns(Promise.resolve('my-parent'));
    storeMock.expects('getDetails').once().withArgs('parent_children', '1').returns(Promise.resolve('some-details'));

    const instance = typeInstance(store, app, {
        schema : {
            properties : {}
        }
    }, uuid, ajv, securityHandler, jsonpath, hostnameResolver);

    const req = {
        path : '/parent/1/children/.details',
        params : {
            parent : 1
        }
    };

    const res = {
        json : (data) => {
            expect(data).toEqual('some-details');
        },
        end : () => {
            storeMock.verify();

            done();
        }
    };

    instance.getDetailsHandler(req, res);
};

const getDetailsErrorTest = (done) => {
    const storeMock = sinon.mock(store);
    storeMock.expects('getDetails').once().withArgs('children', null).returns(Promise.reject(new Error('oops')));

    const instance = typeInstance(store, app, {
        schema : {
            properties : {}
        }
    }, uuid, ajv, securityHandler, jsonpath, hostnameResolver);

    const req = {
        path : '/children/.details',
    };

    const res = {
        status : (code) => {
            expect(code).toEqual(500);
            return res;
        },
        json : (data) => {
            expect(data).toEqual({
                errors : ['Error: oops']
            });
            return res;
        },
        end : () => {
            storeMock.verify();

            done();
        }
    };

    instance.getDetailsHandler(req, res);
};

const uniqueNoKeysTest = (done) => {
    const instance = typeInstance(store, app, {
        schema : {
            properties : {}
        }
    }, uuid, ajv, securityHandler, jsonpath, hostnameResolver);

    instance.isUnique('this thing').then((result) => {
        expect(result).toEqual({
            isUnique    : true,
            errors      : []
        });

        done();
    });
};

const uniqueNoneUniqueKeysTest = (done) => {
    const instance = typeInstance(store, app, {
        schema : {
            properties : {}
        },
        keys : [
            {
                type : 'this is not unique'
            }
        ]
    }, uuid, ajv, securityHandler, jsonpath, hostnameResolver);

    instance.isUnique('this thing').then((result) => {
        expect(result).toEqual({
            isUnique    : true,
            errors      : []
        });

        done();
    });
};

const uniqueNotUniqueTest = (done) => {
    const storeMock = sinon.mock(store);
    storeMock.expects('getResources').once().withArgs('this thing', 0, 1, [
        {
            path    : '$.this.path',
            value   : 'my-value'
        }
    ]).returns(Promise.resolve([
        'oh noes'
    ]))

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        },
        keys : [
            {
                type : 'unique',
                paths : [
                    '$.this.path'
                ]
            }
        ]
    }, uuid, ajv, securityHandler, null, hostnameResolver);

    instance.isUnique({
        this : {
            path : 'my-value'
        }
    }, '$.this').then((result) => {
        expect(result).toEqual({
            isUnique    : false,
            errors      : [
                'Duplicate key error - $.this.path'
            ]
        });

        storeMock.verify();

        done();
    });
};

const uniqueTest = (done) => {
    const storeMock = sinon.mock(store);
    storeMock.expects('getResources').once().withArgs('this thing', 0, 1, [
        {
            path    : '$.this.path',
            value   : 'my-value'
        }
    ]).returns(Promise.resolve([]))

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        },
        keys : [
            {
                type : 'unique',
                paths : [
                    '$.this.path'
                ]
            }
        ]
    }, uuid, ajv, securityHandler, null, hostnameResolver);

    instance.isUnique({
        this : {
            path : 'my-value'
        }
    }, '$.this').then((result) => {
        expect(result).toEqual({
            isUnique    : true,
            errors      : []
        });

        storeMock.verify();

        done();
    });
};

const createInvalidBodyTest = (done) => {
    const validator = function() {
        validator.errors = 'some-errors';
        return false;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().withArgs('my-schema').returns(validator);

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        },
    }, uuid, ajv, securityHandler, null, hostnameResolver);

    //manually set the schemas
    instance.schemas.parent_child = 'my-schema';

    const res = {
        status : (code) => {
            expect(code).toEqual(422);
            return res;
        },
        json : (data) => {
            expect(data).toEqual({
                errors: 'some-errors'
            });
            return res;
        },
        end : () => {
            ajvMock.verify();

            done();
        }
    };

    instance.createHandler({
        path : '/parent/1/child/2',
        params : {
            parentId : 1,
            childId : 2
        },
        body : 'the-body'
    }, res);
};

const createNoneUniqueTest = (done) => {
    const validator = function() {
        return true;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(validator);

    const storeMock = sinon.mock(store);
    storeMock.expects('getResources').once().withArgs('this thing', 0, 1, [
        {
            path    : '$.this.path',
            value   : 'my-value'
        }
    ]).returns(Promise.resolve([
        'oh noes'
    ]))

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        },
        keys : [
            {
                type : 'unique',
                paths : [
                    '$.this.path'
                ]
            }
        ]
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    //manually set the schemas
    instance.schemas.parent = 'my-schema';

    const res = {
        status : (code) => {
            expect(code).toEqual(409);
            return res;
        },
        json : (data) => {
            expect(data).toEqual({
                errors: [
                    'Duplicate key error - $.this.path'
                ]
            });
            return res;
        },
        end : () => {
            ajvMock.verify();
            storeMock.verify();

            done();
        }
    };

    instance.createHandler({
        path : '/this/1/path',
        params : {
            parentId : 1
        },
        body : {
            this : {
                path : 'my-value'
            }
        }
    }, res);
};

const createNoSuchParentTest = (done) => {
    const validator = function() {
        return true;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(validator);

    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent', '1').returns(Promise.resolve(null));

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    //manually set the schemas
    instance.schemas.parent = 'my-schema';

    const res = {
        status : (code) => {
            expect(code).toEqual(404);
            return res;
        },
        end : () => {
            ajvMock.verify();
            storeMock.verify();

            done();
        }
    };

    instance.createHandler({
        path : '/parent/1/child/2',
        params : {
            parentId : 1,
            childId : 2
        },
        body : {
            this : {
                path : 'my-value'
            }
        }
    }, res);
};

const createParentErrorTest = (done) => {
    const validator = function() {
        return true;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(validator);

    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent', '1').returns(Promise.reject(new Error('oh noes')));

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    //manually set the schemas
    instance.schemas.parent = 'my-schema';

    const res = {
        status : (code) => {
            expect(code).toEqual(500);
            return res;
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oh noes'
                ]
            });
            return res;
        },
        end : () => {
            ajvMock.verify();
            storeMock.verify();

            done();
        }
    };

    instance.createHandler({
        path : '/parent/1/child/2',
        params : {
            parentId : 1,
            childId : 2
        },
        body : {
            this : {
                path : 'my-value'
            }
        }
    }, res);
};

const createExistingParent = (done) => {
    const validator = function() {
        return true;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(validator);

    const uuidMock = sinon.mock(uuid);
    uuidMock.expects('main').once().returns('new-id');

    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent', '1').returns(Promise.resolve('the-parent'));
    storeMock.expects('createResource').once().withArgs('parent_child', 'new-id', 'the-body').returns(Promise.resolve(true));

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    //manually set the schemas
    instance.schemas.parent = 'my-schema';

    const res = {
        header : (name, value) => {
            expect(name).toEqual('Location');
            expect(value).toEqual('/this thing/new-id');
            return res;
        },
        status : (code) => {
            expect(code).toEqual(201);
            return res;
        },
        end : () => {
            ajvMock.verify();
            storeMock.verify();
            uuidMock.verify();

            done();
        }
    };

    instance.createHandler({
        path : '/parent/1/child',
        params : {
            parentId : 1
        },
        body : 'the-body'
    }, res);
};

const createFailureTest = (done) => {
    const validator = function() {
        return true;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(validator);

    const uuidMock = sinon.mock(uuid);
    uuidMock.expects('main').once().returns('new-id');

    const storeMock = sinon.mock(store);
    storeMock.expects('createResource').once().withArgs('parent', 'new-id', 'the-body').returns(Promise.resolve(false));

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    //manually set the schemas
    instance.schemas.parent = 'my-schema';

    const res = {
        status : (code) => {
            expect(code).toEqual(424);
            return res;
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'error constructing object'
                ]
            });
            return res;
        },
        end : () => {
            ajvMock.verify();
            storeMock.verify();
            uuidMock.verify();

            done();
        }
    };

    instance.createHandler({
        path : '/parent',
        body : 'the-body'
    }, res);
};

const createErrorTest = (done) => {
    const validator = function() {
        return true;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(validator);

    const uuidMock = sinon.mock(uuid);
    uuidMock.expects('main').once().returns('new-id');

    const storeMock = sinon.mock(store);
    storeMock.expects('createResource').once().withArgs('parent', 'new-id', 'the-body').returns(Promise.reject(new Error('oops')));

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    //manually set the schemas
    instance.schemas.parent = 'my-schema';

    const res = {
        status : (code) => {
            expect(code).toEqual(500);
            return res;
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oops'
                ]
            });
            return res;
        },
        end : () => {
            ajvMock.verify();
            storeMock.verify();
            uuidMock.verify();

            done();
        }
    };

    instance.createHandler({
        path : '/parent',
        body : 'the-body'
    }, res);
};

 const getSingleNoSuchParentTest = (done) => {
    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent', '1').returns(Promise.resolve(null));

    const instance = typeInstance(store, app, {
        schema : {
            properties : {}
        }
    }, uuid, ajv, securityHandler, jsonpath, hostnameResolver);

    const req = {
        path : '/parent/1/children/2',
        params : {
            parent : 1
        }
    };

    const res = {
        status : (code) => {
            expect(code).toEqual(404);
            return res;
        },
        end : () => {
            storeMock.verify();

            done();
        }
    };

    instance.getSingleHandler(req, res);
 };

const getSingleExistingParentTest = (done) => {
    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent', '1').returns(Promise.resolve('my-parent'));
    storeMock.expects('getResources').once().withArgs('parent_object', 1, 1, [{
        path : '$.parent',
        value : '1'
    }]).returns(Promise.resolve([
        'my item'
    ]));

    const instance = typeInstance(store, app, {
        schema : {
            properties : {}
        }
    }, uuid, ajv, securityHandler, jsonpath, hostnameResolver);

    const req = {
        path : '/parent/1/object',
        params : {
            parentId : 1
        }
    };

    const res = {
        json : (data) => {
            expect(data).toEqual('my item');
            return res;
        },
        end : () => {
            storeMock.verify();

            done();
        }
    };

    instance.getSingleHandler(req, res);
};

const getSingleExistingParentUndefinedChildTest = (done) => {
    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent', '1').returns(Promise.resolve('my-parent'));
    storeMock.expects('getResources').once().withArgs('parent_object', 1, 1, [{
        path : '$.parent',
        value : '1'
    }]).returns(Promise.resolve([]));

    const instance = typeInstance(store, app, {
        schema : {
            properties : {}
        }
    }, uuid, ajv, securityHandler, jsonpath, hostnameResolver);

    const req = {
        path : '/parent/1/object',
        params : {
            parentId : 1
        }
    };

    const res = {
        json : (data) => {
            expect(data).toEqual({});
            return res;
        },
        end : () => {
            storeMock.verify();

            done();
        }
    };

    instance.getSingleHandler(req, res);
};

const getSingleParentErrorTest = (done) => {
    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent', '1').returns(Promise.resolve('my-parent'));
    storeMock.expects('getResources').once().withArgs('parent_object', 1, 1, [{
        path : '$.parent',
        value : '1'
    }]).returns(Promise.reject(new Error(':( sad')));

    const instance = typeInstance(store, app, {
        schema : {
            properties : {}
        }
    }, uuid, ajv, securityHandler, jsonpath, hostnameResolver);

    const req = {
        path : '/parent/1/object',
        params : {
            parentId : 1
        }
    };

    const res = {
        status : (code) => {
            expect(code).toEqual(500);
            return res;
        },
        json : (data) => {
            expect(data).toEqual({
                errors : ['Error: :( sad']
            });
            return res;
        },
        end : () => {
            storeMock.verify();

            done();
        }
    };

    instance.getSingleHandler(req, res);
};

const getSingleNoSuchResource = (done) => {
    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent_child', '2').returns(Promise.resolve(null));

    const instance = typeInstance(store, app, {
        schema : {
            properties : {}
        }
    }, uuid, ajv, securityHandler, jsonpath, hostnameResolver);

    const req = {
        path : '/parent/1/child/2',
        params : {
            parentId : 1,
            childId : 2
        }
    };

    const res = {
        status : (code) => {
            expect(code).toEqual(404);
            return res;
        },
        end : () => {
            storeMock.verify();

            done();
        }
    };

    instance.getSingleHandler(req, res);
};

const getSingleErrorTest = (done) => {
    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent_child', '2').returns(Promise.resolve('my-item'));

    const instance = typeInstance(store, app, {
        schema : {
            properties : {}
        }
    }, uuid, ajv, securityHandler, jsonpath, hostnameResolver);

    const req = {
        path : '/parent/1/child/2',
        params : {
            parentId : 1,
            childId : 2
        }
    };

    const res = {
        json : (data) => {
            expect(data).toEqual('my-item');
        },
        end : () => {
            storeMock.verify();

            done();
        }
    };

    instance.getSingleHandler(req, res);
};

const updateInvalidBodyTest = (done) => {
    const validator = function() {
        validator.errors = 'some-errors';
        return false;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().withArgs('my-schema').returns(validator);

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        },
    }, uuid, ajv, securityHandler, null, hostnameResolver);

    //manually set the schemas
    instance.schemas.parent_child = 'my-schema';

    const res = {
        status : (code) => {
            expect(code).toEqual(422);
            return res;
        },
        json : (data) => {
            expect(data).toEqual({
                errors: 'some-errors'
            });
            return res;
        },
        end : () => {
            ajvMock.verify();

            done();
        }
    };

    instance.updateHandler({
        path : '/parent/1/child/2',
        params : {
            parentId : 1,
            childId : 2
        },
        body : 'the-body'
    }, res);
};

const updateMissingParentTest = (done) => {
    const validator = function() {
        return true;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(validator);

    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent', '1').returns(Promise.resolve(null));

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    //manually set the schemas
    instance.schemas.parent = 'my-schema';

    const res = {
        status : (code) => {
            expect(code).toEqual(404);
            return res;
        },
        end : () => {
            ajvMock.verify();
            storeMock.verify();

            done();
        }
    };

    instance.updateHandler({
        path : '/parent/1/child',
        params : {
            parentId : 1
        },
        body : 'the-body'
    }, res);
};

const updateMissingResource = (done) => {
    const validator = function() {
        return true;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(validator);

    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent_child', '2').returns(Promise.resolve(null));

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    //manually set the schemas
    instance.schemas.parent = 'my-schema';

    const res = {
        status : (code) => {
            expect(code).toEqual(404);
            return res;
        },
        end : () => {
            ajvMock.verify();
            storeMock.verify();

            done();
        }
    };

    instance.updateHandler({
        path : '/parent/1/child/2',
        params : {
            parentId : 1,
            childId : 2
        },
        body : 'the-body'
    }, res);
};

const updateErrorFetchingTest = (done) => {
    const validator = function() {
        return true;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(validator);

    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent_child', '2').returns(Promise.reject(new Error('oh dear')));

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    //manually set the schemas
    instance.schemas.parent = 'my-schema';

    const res = {
        status : (code) => {
            expect(code).toEqual(500);
            return res;
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oh dear'
                ]
            });
            return res;
        },
        end : () => {
            ajvMock.verify();
            storeMock.verify();

            done();
        }
    };

    instance.updateHandler({
        path : '/parent/1/child/2',
        params : {
            parentId : 1,
            childId : 2
        },
        body : 'the-body'
    }, res);
};

const updateFailureTest = (done) => {
    const validator = function() {
        return true;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(validator);

    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent_child', '2').returns(Promise.resolve('the-object'));
    storeMock.expects('updateResource').once().withArgs('parent_child', '2', 'the-body').returns(Promise.resolve(false));

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    //manually set the schemas
    instance.schemas.parent = 'my-schema';

    const res = {
        status : (code) => {
            expect(code).toEqual(424);
            return res;
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'error updating object'
                ]
            });
            return res;
        },
        end : () => {
            ajvMock.verify();
            storeMock.verify();

            done();
        }
    };

    instance.updateHandler({
        path : '/parent/1/child/2',
        params : {
            parentId : 1,
            childId : 2
        },
        body : 'the-body'
    }, res);
};

const updateTest = (done) => {
    const validator = function() {
        return true;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(validator);

    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent', '1').returns(Promise.resolve('the-parent'));
    storeMock.expects('updateResource').once().withArgs('parent_child', 'child-id', 'the-body').returns(Promise.resolve(true));

    const uuidMock = sinon.mock(uuid);
    uuidMock.expects('main').once().returns('child-id');

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    //manually set the schemas
    instance.schemas.parent = 'my-schema';

    const res = {
        header : (name, value) => {
            expect(name).toEqual('Location');
            expect(value).toEqual('/parent/1/child');
            return res;
        },
        status : (code) => {
            expect(code).toEqual(204);
            return res;
        },
        end : () => {
            ajvMock.verify();
            storeMock.verify();
            uuidMock.verify();

            done();
        }
    };

    instance.updateHandler({
        path : '/parent/1/child',
        params : {
            parentId : 1
        },
        body : 'the-body'
    }, res);
};

const deleteNotExistTest = (done) => {
    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent_child', '2').returns(Promise.resolve(null));

    const instance = typeInstance(store, app, {
        schema : {
            properties : {}
        }
    }, uuid, ajv, securityHandler, jsonpath, hostnameResolver);

    const req = {
        path : '/parent/1/child/2',
        params : {
            parentId : 1,
            childId : 2
        }
    };

    const res = {
        status : (code) => {
            expect(code).toEqual(404);
            return res;
        },
        end : () => {
            storeMock.verify();

            done();
        }
    };

    instance.deleteHandler(req, res);
};

const deleteSuccessErrorTest = (done) => {
    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent_child', '2').returns(Promise.resolve('an-item'));
    storeMock.expects('deleteResource').once().withArgs('parent_child', '2').returns(Promise.resolve(false));

    const instance = typeInstance(store, app, {
        schema : {
            properties : {}
        }
    }, uuid, ajv, securityHandler, jsonpath, hostnameResolver);

    const req = {
        path : '/parent/1/child/2',
        params : {
            parentId : 1,
            childId : 2
        }
    };

    const res = {
        status : (code) => {
            expect(code).toEqual(424);
            return res;
        },
        json : (data) => {
            expect(data).toEqual({
                errors : ['error deleting object']
            })
            return res;
        },
        end : () => {
            storeMock.verify();

            done();
        }
    };

    instance.deleteHandler(req, res);
};

const deleteExceptionTest = (done) => {
    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent_child', '2').returns(Promise.resolve('an-item'));
    storeMock.expects('deleteResource').once().withArgs('parent_child', '2').returns(Promise.reject(new Error('error deleting')));

    const instance = typeInstance(store, app, {
        schema : {
            properties : {}
        }
    }, uuid, ajv, securityHandler, jsonpath, hostnameResolver);

    const req = {
        path : '/parent/1/child/2',
        params : {
            parentId : 1,
            childId : 2
        }
    };

    const res = {
        status : (code) => {
            expect(code).toEqual(500);
            return res;
        },
        json : (data) => {
            expect(data).toEqual({
                errors : ['Error: error deleting']
            })
            return res;
        },
        end : () => {
            storeMock.verify();

            done();
        }
    };

    instance.deleteHandler(req, res);
};

const deleteTest = (done) => {
        const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent_child', '2').returns(Promise.resolve('an-item'));
    storeMock.expects('deleteResource').once().withArgs('parent_child', '2').returns(Promise.resolve(true));

    const instance = typeInstance(store, app, {
        schema : {
            properties : {}
        }
    }, uuid, ajv, securityHandler, jsonpath, hostnameResolver);

    const req = {
        path : '/parent/1/child/2',
        params : {
            parentId : 1,
            childId : 2
        }
    };

    const res = {
        status : (code) => {
            expect(code).toEqual(204);
            return res;
        },
        end : () => {
            storeMock.verify();

            done();
        }
    };

    instance.deleteHandler(req, res);
};

const patchMissingParentTest = (done) => {
    const validator = function() {
        return true;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(validator);

    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent', '1').returns(Promise.resolve(null));

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    //manually set the schemas
    instance.schemas.parent = 'my-schema';

    const res = {
        status : (code) => {
            expect(code).toEqual(404);
            return res;
        },
        end : () => {
            ajvMock.verify();
            storeMock.verify();

            done();
        }
    };

    instance.patchHandler({
        path : '/parent/1/child',
        params : {
            parentId : 1
        },
        body : 'the-body'
    }, res);
};

const patchMissingResource = (done) => {
    const validator = function() {
        return true;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(validator);

    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent', '1').returns(Promise.resolve('the-parent'));
    storeMock.expects('getResource').once().withArgs('parent_child', '2').returns(Promise.resolve(null));

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    //manually set the schemas
    instance.schemas.parent = 'my-schema';

    const res = {
        status : (code) => {
            expect(code).toEqual(404);
            return res;
        },
        end : () => {
            ajvMock.verify();
            storeMock.verify();

            done();
        }
    };

    instance.patchHandler({
        path : '/parent/1/child/2',
        params : {
            parentId : 1,
            childId : 2
        },
        body : 'the-body'
    }, res);
};

const patchErrorFetchingTest = (done) => {
    const validator = function() {
        return true;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(validator);

    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent', '1').returns(Promise.reject(new Error('oh dear')));

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    //manually set the schemas
    instance.schemas.parent = 'my-schema';

    const res = {
        status : (code) => {
            expect(code).toEqual(500);
            return res;
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oh dear'
                ]
            });
            return res;
        },
        end : () => {
            ajvMock.verify();
            storeMock.verify();

            done();
        }
    };

    instance.patchHandler({
        path : '/parent/1/child/2',
        params : {
            parentId : 1,
            childId : 2
        },
        body : 'the-body'
    }, res);
};

const patchInvalidMergeTest = (done) => {
    const validator = function() {
        validator.errors = 'some-errors';
        return false;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().withArgs('my-schema').returns(validator);

    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent', '1').returns(Promise.resolve({ hello : 'world' }));

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    //manually set the schemas
    instance.schemas.parent = 'my-schema';

    const res = {
        status : (code) => {
            expect(code).toEqual(422);
            return res;
        },
        json : (data) => {
            expect(data).toEqual({
                errors : 'some-errors'
            });
            return res;
        },
        end : () => {
            ajvMock.verify();
            storeMock.verify();

            done();
        }
    };

    instance.patchHandler({
        path : '/parent/1',
        params : {
            parentId : 1
        },
        body : {
            something : 'else',
            hello : 'there'
        }
    }, res);
};

const patchFailureTest = (done) => {
    const validator = function() {
        return true;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(validator);

    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent', '1').returns(Promise.resolve({ hello : 'world' }));
    storeMock.expects('updateResource').once().withArgs('parent', '1', {
        hello : 'there',
        something : 'else'
    }).returns(Promise.resolve(false));

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    //manually set the schemas
    instance.schemas.parent = 'my-schema';

    const res = {
        status : (code) => {
            expect(code).toEqual(424);
            return res;
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'error updating object'
                ]
            });
            return res;
        },
        end : () => {
            ajvMock.verify();
            storeMock.verify();

            done();
        }
    };

    instance.patchHandler({
        path : '/parent/1',
        params : {
            parentId : 1
        },
        body : {
            something : 'else',
            hello : 'there'
        }
    }, res);
};

const patchInvalidMergeParentTest = (done) => {
    const validator = function() {
        validator.errors = 'some-errors';
        return false;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(validator);

    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent', '1').returns(Promise.resolve('the-parent'));
    storeMock.expects('getResources').once().withArgs('parent_child', 1, 1, [
        {
            path : '$.parent',
            value : '1'
        }
    ]).returns(Promise.resolve([{ id : '1234', hello : 'world' }]));

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    //manually set the schemas
    instance.schemas.parent = 'my-schema';

    const res = {
        status : (code) => {
            expect(code).toEqual(422);
            return res;
        },
        json : (data) => {
            expect(data).toEqual({
                errors : 'some-errors'
            });
            return res;
        },
        end : () => {
            ajvMock.verify();
            storeMock.verify();

            done();
        }
    };

    instance.patchHandler({
        path : '/parent/1/child',
        params : {
            parentId : 1
        },
        body : {
            something : 'else',
            hello : 'there'
        }
    }, res);
};

const patchFailureParentTest = (done) => {
    const validator = function() {
        return true;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(validator);

    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent', '1').returns(Promise.resolve('the-parent'));
    storeMock.expects('getResources').once().withArgs('parent_child', 1, 1, [
        {
            path : '$.parent',
            value : '1'
        }
    ]).returns(Promise.resolve([{ id : '1234', hello : 'world' }]));
    storeMock.expects('updateResource').once().withArgs('parent_child', '1234', {
        id : '1234',
        hello : 'there',
        something : 'else',
        parent : '1'
    }).returns(Promise.resolve(false));

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    //manually set the schemas
    instance.schemas.parent = 'my-schema';

    const res = {
        status : (code) => {
            expect(code).toEqual(424);
            return res;
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'error updating object'
                ]
            });
            return res;
        },
        end : () => {
            ajvMock.verify();
            storeMock.verify();

            done();
        }
    };

    instance.patchHandler({
        path : '/parent/1/child',
        params : {
            parentId : 1
        },
        body : {
            something : 'else',
            hello : 'there'
        }
    }, res);
};

const patchTest = (done) => {
    const validator = function() {
        return true;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(validator);

    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent', '1').returns(Promise.resolve({ hello : 'world' }));
    storeMock.expects('updateResource').once().withArgs('parent', '1', {
        hello : 'there',
        something : 'else'
    }).returns(Promise.resolve(true));

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    //manually set the schemas
    instance.schemas.parent = 'my-schema';

    const res = {
        status : (code) => {
            expect(code).toEqual(204);
            return res;
        },
        header : (name, value) => {
            expect(name).toEqual('Location');
            expect(value).toEqual('/parent/1');
        },
        end : () => {
            ajvMock.verify();
            storeMock.verify();

            done();
        }
    };

    instance.patchHandler({
        path : '/parent/1',
        params : {
            parentId : 1
        },
        body : {
            something : 'else',
            hello : 'there'
        }
    }, res);
};

const patchParentTest = (done) => {
    const validator = function() {
        return true;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(validator);

    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent', '1').returns(Promise.resolve('the-parent'));
    storeMock.expects('getResources').once().withArgs('parent_child', 1, 1, [
        {
            path : '$.parent',
            value : '1'
        }
    ]).returns(Promise.resolve([{ id : '1234', hello : 'world' }]));
    storeMock.expects('updateResource').once().withArgs('parent_child', '1234', {
        id : '1234',
        hello : 'there',
        something : 'else',
        parent : '1'
    }).returns(Promise.resolve(true));

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    //manually set the schemas
    instance.schemas.parent = 'my-schema';

    const res = {
        status : (code) => {
            expect(code).toEqual(204);
            return res;
        },
        header : (name, value) => {
            expect(name).toEqual('Location');
            expect(value).toEqual('/parent/1/child');
        },
        end : () => {
            ajvMock.verify();
            storeMock.verify();

            done();
        }
    };

    instance.patchHandler({
        path : '/parent/1/child',
        params : {
            parentId : 1
        },
        body : {
            something : 'else',
            hello : 'there'
        }
    }, res);
};

const patchParentNotDefinedTest = (done) => {
    const validator = function() {
        return true;
    };

    const ajvMock = sinon.mock(ajv);
    ajvMock.expects('compile').once().returns(validator);

    const storeMock = sinon.mock(store);
    storeMock.expects('getResource').once().withArgs('parent', '1').returns(Promise.resolve('the-parent'));
    storeMock.expects('getResources').once().withArgs('parent_child', 1, 1, [
        {
            path : '$.parent',
            value : '1'
        }
    ]).returns(Promise.resolve([]));
    storeMock.expects('updateResource').once().withArgs('parent_child', sinon.match.any, {
        id : sinon.match.any,
        hello : 'there',
        something : 'else',
        parent : '1'
    }).returns(Promise.resolve(true));

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    //manually set the schemas
    instance.schemas.parent = 'my-schema';

    const res = {
        status : (code) => {
            expect(code).toEqual(204);
            return res;
        },
        header : (name, value) => {
            expect(name).toEqual('Location');
            expect(value).toEqual('/parent/1/child');
        },
        end : () => {
            ajvMock.verify();
            storeMock.verify();

            done();
        }
    };

    instance.patchHandler({
        path : '/parent/1/child',
        params : {
            parentId : 1
        },
        body : {
            something : 'else',
            hello : 'there'
        }
    }, res);
};

const determineGetHandlerTest = (done) => {
    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    expect(instance.determineHandler('listing')).toEqual(instance.getHandler);

    done();
};

const determineGetDetailsHandlerTest = (done) => {
    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    expect(instance.determineHandler('details')).toEqual(instance.getDetailsHandler);

    done();
};

const determineCreateHandlerTest = (done) => {
    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    expect(instance.determineHandler('create')).toEqual(instance.createHandler);

    done();
};

const determineGetSingleHandlerTest = (done) => {
    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    expect(instance.determineHandler('singular')).toEqual(instance.getSingleHandler);

    done();
};

const determineUpdateHandlerTest = (done) => {
    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    expect(instance.determineHandler('update')).toEqual(instance.updateHandler);

    done();
};

const determineDeleteHandlerTest = (done) => {
    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    expect(instance.determineHandler('delete')).toEqual(instance.deleteHandler);

    done();
};

const determinePatchHandlerTest = (done) => {
    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    expect(instance.determineHandler('patch')).toEqual(instance.patchHandler);

    done();
};

const determineUnknownHandlerTest = (done) => {
    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    expect(instance.determineHandler('woot')()).toEqual(undefined);

    done();
};

const normaliseNameTest = (done) => {
    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    expect(instance.normaliseName('hello there')).toEqual('hello_there');

    done();
};

const determinePathSimpleSchemaTest = (done) => {
    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {}
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    expect(instance.determinePaths('parent', 'child', 'child full name', true)).toEqual([
        {
            method: 'get',
            path: 'parent/child',
            type: 'listing',
            schema: true,
            name: 'child full name'
        },
        {
            method: 'get',
            path: 'parent/child/.details',
            type: 'details',
            schema: true,
            name: 'child full name'
        },
        {
            method: 'post',
            path: 'parent/child',
            type: 'create',
            schema: true,
            name: 'child full name'
        },
        {
            method: 'get',
            path: 'parent/child/:childId',
            type: 'singular',
            schema: true,
            name: 'child full name'
        },
        {
            method: 'put',
            path: 'parent/child/:childId',
            type: 'update',
            schema: true,
            name: 'child full name'
        },
        {
            method: 'delete',
            path: 'parent/child/:childId',
            type: 'delete',
            schema: true,
            name: 'child full name'
        },
        {
            method: 'patch',
            path: 'parent/child/:childId',
            type: 'patch',
            schema: true,
            name: 'child full name'
        }
    ]);

    done();
};

const determinePathListsOfChildrenTest = (done) => {
    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {
                children : {
                    type : 'array',
                    items : {
                        type : 'object',
                        properties : {
                            name : {
                                type : 'string'
                            }
                        }
                    }
                }
            }
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    expect(instance.determinePaths('parent', 'child', 'child full name', {
        type : 'object',
        properties : {
            'children' : {
                type : 'array',
                items : {
                    type : 'object',
                    properties : {
                        name : {
                            type : 'string'
                        }
                    }
                }
            }
        }
    })).toEqual([
        {
            "method": "get",
            "path": "parent/child",
            "type": "listing",
            "schema": {
                "type": "object",
                "properties": {}
            },
            "name": "child full name"
        },
        {
            "method": "get",
            "path": "parent/child/.details",
            "type": "details",
            "schema": {
                "type": "object",
                "properties": {}
            },
            "name": "child full name"
        },
        {
            "method": "post",
            "path": "parent/child",
            "type": "create",
            "schema": {
                "type": "object",
                "properties": {}
            },
            "name": "child full name"
        },
        {
            "method": "get",
            "path": "parent/child/:childId",
            "type": "singular",
            "schema": {
                "type": "object",
                "properties": {}
            },
            "name": "child full name"
        },
        {
            "method": "put",
            "path": "parent/child/:childId",
            "type": "update",
            "schema": {
                "type": "object",
                "properties": {}
            },
            "name": "child full name"
        },
        {
            "method": "delete",
            "path": "parent/child/:childId",
            "type": "delete",
            "schema": {
                "type": "object",
                "properties": {}
            },
            "name": "child full name"
        },
        {
            "method": "patch",
            "path": "parent/child/:childId",
            "type": "patch",
            "schema": {
                "type": "object",
                "properties": {}
            },
            "name": "child full name"
        },
        {
            "method": "get",
            "path": "parent/child/:childId/children",
            "type": "listing",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    }
                }
            },
            "name": "child_full name_children"
        },
        {
            "method": "get",
            "path": "parent/child/:childId/children/.details",
            "type": "details",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    }
                }
            },
            "name": "child_full name_children"
        },
        {
            "method": "post",
            "path": "parent/child/:childId/children",
            "type": "create",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    }
                }
            },
            "name": "child_full name_children"
        },
        {
            "method": "get",
            "path": "parent/child/:childId/children/:childrenId",
            "type": "singular",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    }
                }
            },
            "name": "child_full name_children"
        },
        {
            "method": "put",
            "path": "parent/child/:childId/children/:childrenId",
            "type": "update",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    }
                }
            },
            "name": "child_full name_children"
        },
        {
            "method": "delete",
            "path": "parent/child/:childId/children/:childrenId",
            "type": "delete",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    }
                }
            },
            "name": "child_full name_children"
        },
        {
            "method": "patch",
            "path": "parent/child/:childId/children/:childrenId",
            "type": "patch",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    }
                }
            },
            "name": "child_full name_children"
        }
    ]);

    done();
};

const determinePathChildrenObjectsTest = (done) => {
    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            properties : {
                children : {
                    type : 'object',
                    properties : {
                        name : {
                            type : 'string'
                        }
                    }
                }
            }
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    expect(instance.determinePaths('parent', 'child', 'child full name', {
        type : 'object',
        properties : {
            children : {
                type : 'object',
                properties : {
                    name : {
                        type : 'string'
                    }
                }
            }
        }
    })).toEqual([
        {
            "method": "get",
            "path": "parent/child",
            "type": "listing",
            "schema": {
                "type": "object",
                "properties": {}
            },
            "name": "child full name"
        },
        {
            "method": "get",
            "path": "parent/child/.details",
            "type": "details",
            "schema": {
                "type": "object",
                "properties": {}
            },
            "name": "child full name"
        },
        {
            "method": "post",
            "path": "parent/child",
            "type": "create",
            "schema": {
                "type": "object",
                "properties": {}
            },
            "name": "child full name"
        },
        {
            "method": "get",
            "path": "parent/child/:childId",
            "type": "singular",
            "schema": {
                "type": "object",
                "properties": {}
            },
            "name": "child full name"
        },
        {
            "method": "put",
            "path": "parent/child/:childId",
            "type": "update",
            "schema": {
                "type": "object",
                "properties": {}
            },
            "name": "child full name"
        },
        {
            "method": "delete",
            "path": "parent/child/:childId",
            "type": "delete",
            "schema": {
                "type": "object",
                "properties": {}
            },
            "name": "child full name"
        },
        {
            "method": "patch",
            "path": "parent/child/:childId",
            "type": "patch",
            "schema": {
                "type": "object",
                "properties": {}
            },
            "name": "child full name"
        },
        {
            "method": "get",
            "path": "parent/child/:childId/children",
            "type": "singular",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    }
                }
            },
            "name": "child_full name_children"
        },
        {
            "method": "put",
            "path": "parent/child/:childId/children",
            "type": "update",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    }
                }
            },
            "name": "child_full name_children"
        },
        {
            "method": "patch",
            "path": "parent/child/:childId/children",
            "type": "patch",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    }
                }
            },
            "name": "child_full name_children"
        }
    ]);

    done();
};

const initRoleDefaultsCheck = (done) => {
    const securityHandlerMock = sinon.mock(securityHandler);
    securityHandlerMock.expects('enforce').exactly(4).withArgs(sinon.match.any, {
        mechanism   : null,
        roles       : ['system_admin', 'system_reader', 'data_reader', 'this thing_reader']
    }).returns('reader roles');
    securityHandlerMock.expects('enforce').exactly(3).withArgs(sinon.match.any, {
        mechanism   : null,
        roles       : ['system_admin', 'system_writer', 'data_writer', 'this thing_writer']
    }).returns('writer roles');

    const appMock = sinon.mock(app);
    appMock.expects('get').once().withArgs('/this_thing/.definition', sinon.match.any);
    appMock.expects('get').once().withArgs('/this_thing', 'reader roles');
    appMock.expects('get').once().withArgs('/this_thing/.details', 'reader roles');
    appMock.expects('get').once().withArgs('/this_thing/:this_thingId', 'reader roles');

    const instance = typeInstance(store, app, {
        name : 'this thing',
        schema : {
            type : 'object',
            properties : {
                name : {
                    type : 'string'
                }
            }
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    instance.init().then(() => {
        securityHandlerMock.verify();
        appMock.verify();

        done();
    });
};

const initRoleReplaceCheck = (done) => {
    const securityHandlerMock = sinon.mock(securityHandler);
    securityHandlerMock.expects('enforce').exactly(7).withArgs(sinon.match.any, {
        mechanism   : 'test',
        roles       : ['system_admin']
    }).returns('system admin only role');

    const appMock = sinon.mock(app);
    appMock.expects('get').once().withArgs('/this_thing/.definition', sinon.match.any);
    appMock.expects('get').once().withArgs('/this_thing', 'system admin only role');
    appMock.expects('get').once().withArgs('/this_thing/.details', 'system admin only role');
    appMock.expects('get').once().withArgs('/this_thing/:this_thingId', 'system admin only role');

    const instance = typeInstance(store, app, {
        name : 'this thing',
        security : {
            mechanism : 'test'
        },
        roles : {
            replace : {
                read : true,
                write : true,
                delete : true
            }
        },
        schema : {
            type : 'object',
            properties : {
                name : {
                    type : 'string'
                }
            }
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    instance.init().then(() => {
        securityHandlerMock.verify();
        appMock.verify();

        done();
    });
};

const initRoleAddsCheck = (done) => {
    const securityHandlerMock = sinon.mock(securityHandler);
    securityHandlerMock.expects('enforce').exactly(4).withArgs(sinon.match.any, {
        mechanism   : null,
        roles       : ['system_admin', 'reader']
    }).returns('custom roles');
    securityHandlerMock.expects('enforce').exactly(2).withArgs(sinon.match.any, {
        mechanism   : null,
        roles       : ['system_admin', 'writer']
    }).returns('custom roles');
    securityHandlerMock.expects('enforce').exactly(1).withArgs(sinon.match.any, {
        mechanism   : null,
        roles       : ['system_admin', 'deleter']
    }).returns('custom roles');

    const appMock = sinon.mock(app);
    appMock.expects('get').once().withArgs('/this_thing/.definition', sinon.match.any);
    appMock.expects('get').once().withArgs('/this_thing', 'custom roles');
    appMock.expects('get').once().withArgs('/this_thing/.details', 'custom roles');
    appMock.expects('get').once().withArgs('/this_thing/:this_thingId', 'custom roles');

    const instance = typeInstance(store, app, {
        name : 'this thing',
        roles : {
            replace : {
                read : true,
                write : true,
                delete : true
            },
            read : ['reader'],
            write : ['writer'],
            delete : ['deleter'],
        },
        schema : {
            type : 'object',
            properties : {
                name : {
                    type : 'string'
                }
            }
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    instance.init().then(() => {
        securityHandlerMock.verify();
        appMock.verify();

        done();
    });
};

const initRoleNoRolesCheck = (done) => {
    const securityHandlerMock = sinon.mock(securityHandler);
    securityHandlerMock.expects('enforce').exactly(4).withArgs(sinon.match.any, {
        mechanism   : null,
        roles       : null
    }).returns('no roles');
    securityHandlerMock.expects('enforce').exactly(2).withArgs(sinon.match.any, {
        mechanism   : null,
        roles       : null
    }).returns('no roles');
    securityHandlerMock.expects('enforce').exactly(1).withArgs(sinon.match.any, {
        mechanism   : null,
        roles       : null
    }).returns('no roles');

    const appMock = sinon.mock(app);
    appMock.expects('get').once().withArgs('/this_thing/.definition', sinon.match.any);
    appMock.expects('get').once().withArgs('/this_thing', 'no roles');
    appMock.expects('get').once().withArgs('/this_thing/.details', 'no roles');
    appMock.expects('get').once().withArgs('/this_thing/:this_thingId', 'no roles');

    const instance = typeInstance(store, app, {
        name : 'this thing',
        roles : {
            needsRole : {
                read : false,
                write : false,
                delete : false
            }
        },
        schema : {
            type : 'object',
            properties : {
                name : {
                    type : 'string'
                }
            }
        }
    }, uuid.main, ajv, securityHandler, null, hostnameResolver);

    instance.init().then(() => {
        securityHandlerMock.verify();
        appMock.verify();

        done();
    });
};

describe('A storage types instance', () => {
    it('defaults its constructor arguments', constructorTest);

    it('can determine identifiers', determineIdentifiersTest);
    it('can determine identifiers on empty path', determineIdentifiersEmptyPathTest);

    describe('get handler', () => {
        it('handles no such parent', getListNotFoundTest);
        it('handles existing parent', getListParentFoundTest);
        it('handles storage errors', getListErrorTest);
        it('processes filters correctly', getListFilterTest);
        it('processes orders correctly', getListOrderTest);
    });

    describe('get details handler', () => {
        it('handles no such parent', getDetailsNotFoundTest);
        it('handles existing parent', getDetailsParentFoundTest);
        it('handles get details errors', getDetailsErrorTest);
    });

    describe('can detect unique objects', () => {
        it('handling no keys', uniqueNoKeysTest);
        it('handling none unique keys', uniqueNoneUniqueKeysTest);
        it('handling none unique values', uniqueNotUniqueTest);
        it('handling unique values', uniqueTest);
    });

    describe('create handler', () => {
        it('handles invalid bodies', createInvalidBodyTest);
        it('handles none unique objects', createNoneUniqueTest);
        it('handles parents not existing', createNoSuchParentTest);
        it('handles parents errors', createParentErrorTest);
        it('handles existing parent', createExistingParent);
        it('handles creation failure', createFailureTest);
        it('handles errors creating', createErrorTest);
    });

    describe('get single handler', () => {
        it('handles no such parent', getSingleNoSuchParentTest);
        it('handles existing parent', getSingleExistingParentTest);
        it('handles existing parent', getSingleExistingParentUndefinedChildTest);
        it('handles errors with parent objects', getSingleParentErrorTest);
        it('handles no such resource', getSingleNoSuchResource);
        it('handles errors fetching', getSingleErrorTest);
    });

    describe('update handler', () => {
        it('handles invalid bodies', updateInvalidBodyTest);
        it('handles missing parent', updateMissingParentTest);
        it('handles missing resource', updateMissingResource);
        it('handles error fetching', updateErrorFetchingTest);
        it('handles failure updating', updateFailureTest);
        it('handles updates', updateTest);
    });

    describe('delete handler', () => {
        it('handles the resource not existing', deleteNotExistTest);
        it('handles error deleting object', deleteSuccessErrorTest);
        it('handles exceptions', deleteExceptionTest);
        it('handles deleting objects', deleteTest);
    });

    describe('patch handler', () => {
        it('handles missing parent', patchMissingParentTest);
        it('handles missing resource', patchMissingResource);
        it('handles error fetching', patchErrorFetchingTest);
        it('handles invalid merge', patchInvalidMergeTest);
        it('handles failure updating', patchFailureTest);
        it('handles invalid merge with a parent', patchInvalidMergeParentTest);
        it('handles failure updating with a parent', patchFailureParentTest);
        it('handles patches', patchTest);
        it('handles patches with a parent', patchParentTest);
        it('handles patches with a parent, not defined', patchParentNotDefinedTest);
    });

    describe('determine handler', () => {
        it('can determine get handlers', determineGetHandlerTest);
        it('can determine get details handlers', determineGetDetailsHandlerTest);
        it('can determine create handlers', determineCreateHandlerTest);
        it('can determine get single handlers', determineGetSingleHandlerTest);
        it('can determine update handlers', determineUpdateHandlerTest);
        it('can determine delete handlers', determineDeleteHandlerTest);
        it('can determine patch handlers', determinePatchHandlerTest);
        it('can determine unknown handlers', determineUnknownHandlerTest);
    });

    describe('determine paths', () => {
        it('can determine paths for simple schemas', determinePathSimpleSchemaTest);
        it('can determine paths for lists of children', determinePathListsOfChildrenTest);
        it('can determine paths for children objects', determinePathChildrenObjectsTest);
    });

    describe('init', () => {
        it('with default roles', initRoleDefaultsCheck);
        it('correctly replaces roles', initRoleReplaceCheck);
        it('correctly adds roles', initRoleAddsCheck);
        it('does not need roles', initRoleNoRolesCheck);
    });

    it('can normalise names', normaliseNameTest);
});