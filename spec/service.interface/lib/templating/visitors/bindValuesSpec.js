const bindValues = require('../../../../../src/service.interface/lib/templating/visitors/bindValues');

const bindTest = (done) => {
    const instance = bindValues();

    instance.apply({
        view : [
            {
                children : [
                    {
                        thing : {
                            bind : '$.doot',
                            name : 'wheee'
                        },
                        bind : '$.woot',
                        value : '$.thing',
                        tag : 'textarea'
                    }
                ]
            }
        ]
    }).then((definition) => {
        expect(definition.view).toEqual([
            {
                children : [
                    {
                        thing : {
                            bind : '$.doot',
                            value : '$.doot',
                            name : 'wheee'
                        },
                        bind : '$.woot',
                        value : '$.thing',
                        tag : 'textarea',
                        text : '$.thing',
                        name : 'woot'
                    }
                ]
            }
        ]);

        done();
    });
};

describe('A value binding visitor', () => {
    it('binds variables correctly', bindTest);
});