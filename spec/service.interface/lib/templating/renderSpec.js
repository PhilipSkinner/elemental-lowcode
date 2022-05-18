const
    jasmine 	= require('jasmine'),
    sinon 		= require('sinon'),
    render 		= require('../../../../src/service.interface/lib/templating/render');

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

describe('A template renderer', () => {
    it('defaults its constructor arguments', constructorTest);

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