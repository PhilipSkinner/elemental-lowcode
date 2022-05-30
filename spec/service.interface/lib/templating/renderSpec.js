const
    jasmine 	= require('jasmine'),
    sinon 		= require('sinon'),
    render 		= require('../../../../src/service.interface/lib/templating/render');

const fs = {
    readFile : () => {}
};
const path = {
    join : () => {}
};
const preProcessor = {};

const constructorTest = (done) => {
    const instance = render();
    expect(instance.fs).not.toBe(null);
    expect(instance.path).not.toBe(null);
    expect(instance.preProcessor).not.toBe(null);
    done();
};

const renderTagProperties = () => {
    const instance = render();

    expect(instance.renderTagWithProperties('div', {
        text : 'ignore',
        property : 'hello'
    })).toEqual('<div property="hello" ');
};

const renderTagArrayProperties = () => {
    const instance = render();

    expect(instance.renderTagWithProperties('div', {
        text : 'ignore',
        property : ['hello', 'world']
    })).toEqual('<div property="hello world" ');
};

const renderTagSelectTrue = () => {
    const instance = render();

    expect(instance.renderTagWithProperties('option', {
        selected : 'true'
    })).toEqual('<option selected ');
};

const renderTagSelectOne = () => {
    const instance = render();

    expect(instance.renderTagWithProperties('option', {
        selected : 1
    })).toEqual('<option selected ');
};

const renderTagSelectAnyOther = () => {
    const instance = render();

    expect(instance.renderTagWithProperties('option', {
        selected : false
    })).toEqual('<option');
};

const renderTagOnclickNative = () => {
    const instance = render();

    expect(instance.renderTagWithProperties('a', {
        onclick : {
            eventName : 'my_event',
            params : {
                hello : 'world'
            }
        }
    })).toEqual('<a href="?event=my_event&hello=world"  ');
};

const renderTagOnclickInternal = () => {
    const instance = render();

    expect(instance.renderTagWithProperties('td', {
        onclick : {
            eventName : 'my_event',
            params : {
                hello : 'world'
            }
        }
    })).toEqual('<!-- @internalClickHandler --><td><a href="?event=my_event&hello=world" >');
};

const renderTagOnclickExternal = () => {
    const instance = render();

    expect(instance.renderTagWithProperties('strong', {
        onclick : {
            eventName : 'my_event',
            params : {
                hello : 'world'
            }
        }
    })).toEqual('<!-- @clickHandler --><a href="?event=my_event&hello=world" ><strong');
};

const renderTagSubmit = () => {
    const instance = render();

    expect(instance.renderTagWithProperties('form', {
        submit : {
            eventName : 'my_event',
            params : {
                hello : 'world'
            }
        }
    })).toEqual('<form method="POST" action="?_event=my_event"  ');
};

const loadViewReadError = (done) => {
    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my-view.json').callsArgWith(1, new Error('oh noes'), null);

    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, 'my-view').returns('my-view.json');

    const instance = render(fs, path);

    instance.loadView('my-view').catch((err) => {
        expect(err).toEqual(new Error('oh noes'));

        fsMock.verify();
        pathMock.verify();

        done();
    });
};

const loadViewInvalidJSON = (done) => {
    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my-view.json').callsArgWith(1, null, '{}{}{}{}{}{}{}{}{}{}{}');

    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, 'my-view').returns('my-view.json');

    const instance = render(fs, path);

    instance.loadView('my-view').catch((err) => {
        expect(err).toEqual(new Error('Cannot load view my-view'));

        fsMock.verify();
        pathMock.verify();

        done();
    });
};

const loadViewTest = (done) => {
    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my-view.json').callsArgWith(1, null, '{"hello":"world"}');

    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, 'my-view').returns('my-view.json');

    const instance = render(fs, path);

    instance.loadView('my-view').then((view) => {
        expect(view).toEqual({
            hello : "world"
        });

        fsMock.verify();
        pathMock.verify();

        done();
    });
};

const registerCustomRawTag = () => {
    const instance = render(fs, path, preProcessor);

    instance.registerCustomTag({
        raw  : true,
        view : '{"hello":"world"}',
        name : 'my-tag'
    });

    expect(instance.customTags['my-tag']).toEqual({
        raw  : true,
        view : '{"hello":"world"}',
        name : 'my-tag',
        definition : {
            hello : "world"
        }
    });
};

const registerCustomViewTag = (done) => {
    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my-view.json').callsArgWith(1, null, '{"hello":"world"}');

    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, 'my-view').returns('my-view.json');

    const instance = render(fs, path);

    instance.registerCustomTag({
        view : 'my-view',
        name : 'my-tag'
    });

    setTimeout(() => {
        expect(instance.customTags['my-tag']).toEqual({
            view : 'my-view',
            name : 'my-tag',
            definition : {
                hello : "world"
            }
        });

        fsMock.verify();
        pathMock.verify();

        done();
    });
};

const renderViewTest = (done) => {
    const instance = render();

    instance.renderView({
        tag : 'div',
        text : 'ignore',
        property : 'hello',
        children : [
            {
                tag : "hr"
            },
            {
                tag : 'span',
                text : [
                    "multiple",
                    "values"
                ]
            },
            {
                tag : 'a',
                text : 'oops',
                onclick : {}
            },
            {
                tag : 'b',
                text : 'there',
                onclick : {
                    eventName : 'doot',
                    params : {
                        hello : '$.bag.there',
                        an : {
                            object : {
                                with : 'a scalar',
                                and : [
                                    'an',
                                    'array',
                                    'of',
                                    {
                                        lots_of : 'stuff'
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                tag : 'div',
                text : 'internal',
                onclick : {
                    eventName : 'doot'
                }
            },
            {
                tag : 'div'
            },
            {
                tag : 'form',
                submit: {
                    eventName: 'noot'
                },
                children : [
                    [
                        {
                            tag : "textarea",
                            text : [
                                "hello",
                                "world"
                            ]
                        }
                    ]
                ]
            },
            {
                tag: "form",
                submit: {
                    eventName: "poll",
                    poll: {
                        every: 500
                    }
                },
                children: [
                    {
                        tag: "input",
                        type: "hidden",
                        bind: "$.bag.counter"
                    }
                ]
            },
            {
                tag: "form",
                submit: {
                    eventName: "poll",
                    poll: {}
                },
                children: [
                    {
                        tag: "input",
                        type: "hidden",
                        bind: "$.bag.counter"
                    }
                ]
            },
            {
                tag : 'form',
                submit: {}
            },
            null,
            {
                tag : 'span',
                __display: false
            },
        ]
    }, {
        bag : {
            there : 'world'
        }
    }).then((res) => {
        expect(res).toEqual(`<!DOCTYPE HTML>
<div property="hello" >
    ignore

    <hr />
    <span>
        multiple values
    </span>
    <a>
        oops
    </a>
    <!-- @clickHandler --><a href="?event=doot&hello__bag__there=world&an__object__with=a%20scalar&an__object__and__0=an&an__object__and__1=array&an__object__and__2=of&an__object__and__3__lots_of=stuff&an__object__and__3___scope__data__bag__bag__there=world&an__object___scope__data__bag__bag__there=world&an___scope__data__bag__bag__there=world&_scope__data__bag__bag__there=world" ><b>
        there
    </b></a><!-- /@clickHandler -->
    <!-- @internalClickHandler --><div><a href="?event=doot&" >
        internal
    </a></div><!-- /@internalClickHandler -->
    <div></div>
    <form method="POST" action="?_event=noot"  >
        <textarea>hello world</textarea>

    </form>
    <form method="POST" action="?_event=poll"  data-poll="500"  >
        <input type="hidden"  value="[object Object]"  name="bag$$_$$counter"  />
    </form>
    <form method="POST" action="?_event=poll"  >
        <input type="hidden"  value="[object Object]"  name="bag$$_$$counter"  />
    </form>
    <form method="POST" action=""   />\n\n    \n</div>
`);

        done();
    });
};

describe('A template renderer', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('load view', () => {
        it('handles file read errors', loadViewReadError);
        it('handles invalid JSON', loadViewInvalidJSON);
        it('correctly', loadViewTest);
    });

    describe('register custom tag', () => {
        it('handles raw tags', registerCustomRawTag);
        it('handles view tags', registerCustomViewTag);
    });

    describe('render view', () => {
        it('can render the view', renderViewTest);
    });

    describe('renderTagWithProperties', () => {
        it('can render properties', renderTagProperties);
        it('handles properties that are arrays', renderTagArrayProperties);
        it('can render select properties with true value', renderTagSelectTrue);
        it('can render select properties with 1 value', renderTagSelectOne);
        it('can render select properties with any other value', renderTagSelectAnyOther);
        it('hooks into onclick properties - native', renderTagOnclickNative);
        it('hooks into onclick properties - internal click', renderTagOnclickInternal);
        it('hooks into onclick properties - external click', renderTagOnclickExternal);
        it('hooks into submit properties', renderTagSubmit);
    });
});