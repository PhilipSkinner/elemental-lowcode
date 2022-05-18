const
    sinon           = require('sinon'),
    dataResolver    = require('../../src/support.lib/dataResolver');

const stringFormat = {

};

const environmentService = {
    listEnvironmentVariables : () => {}
};

const resolveSupportsUndefinedReplacement = () => {
    const instance = dataResolver(stringFormat, environmentService);

    expect(instance.resolveValue('$.this', {}, true)).toEqual('');
};

const resolveUndefinedParts = () => {
    const instance = dataResolver(stringFormat, environmentService);

    expect(instance.resolveValue('$..this', {}, false)).toBe('$..this');
};

const functionUnresolvedTest = () => {
    const instance = dataResolver(stringFormat, environmentService);

    expect(instance.resolveFunction('$.this', {})).toEqual('$.this');
};

const functionEvaluateTest = () => {
    const instance = dataResolver(stringFormat, environmentService);

    expect(instance.resolveFunction('$(1 == 2)', {})).toEqual(false);
};

const functionEvaluateErrorTest = () => {
    const instance = dataResolver(stringFormat, environmentService);

    expect(instance.resolveFunction('$(what is this?)', {})).toEqual('');
};

const functionNestedResolution = () => {
    const instance = dataResolver(stringFormat, environmentService);

    expect(instance.resolveFunction('$($(true) == true)', {})).toEqual(true)
};

const functionCorrectString = () => {
    const instance = dataResolver(stringFormat, environmentService);

    expect(instance.detectValues("$.value $.valueType",{value : "the value", valueType : "the type"}
    , {}, false)).toEqual("the value the type")

    expect(instance.detectValues("$.nested.value $.nested.valueType",{ nested : { value : "the value", valueType : "the type"}}
    , {}, false)).toEqual("the value the type")
    
    expect(instance.detectValues("$.valuetype",{value : "the value "}
    , {}, false)).toEqual("the value type")

    expect(instance.detectValues("$.datatypes $.valuetype",{value : "the value ", data: "the data ", datatype :"the dataType i" }
    , {}, false)).toEqual("the dataType is the value type")

    expect(instance.detectValues("$.value", { value : "" }, {}, false)).toEqual("");

    expect(instance.detectValues("$.value",{value : false }, {}, false)).toEqual("false");

    expect(instance.detectValues("$.value",{value : null }, {}, false)).toEqual("");

    expect(instance.detectValues("$.value",{}, {}, false)).toEqual("$.value");
};

describe('A data resolver', () => {
    describe('resolve value', () => {
        it('can resolve undefined as empty strings', resolveSupportsUndefinedReplacement);
        it('handles undefined parts', resolveUndefinedParts);
    });

    describe('resolve function', () => {
        it('doesnt work with unresolved values', functionUnresolvedTest);
        it('evaluates the function correctly', functionEvaluateTest);
        it('handles evaluation errors', functionEvaluateErrorTest);
        it('handles nested functions', functionNestedResolution);
    });

    describe('detectValues', () =>{
        it('gives correct string value', functionCorrectString);
    })
});