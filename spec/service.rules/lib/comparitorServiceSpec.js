const
    jasmine 			= require('jasmine'),
    comparitorService 	= require('../../../src/service.rules/lib/comparitorService');

const instance = comparitorService();
const facts = {
    'hello' : 'world',
    'isnull' : null,
    'number' : 3,
    'deeper' : {
        'value' : 'here',
        'isnull' : null,
        'number' : 42
    }
};

const equalityTest = (done) => {
    expect(instance.evaluate(facts, [
        {
            input : '$.hello',
            operator : 'eq',
            value : 'world'
        },
        {
            input : '$.deeper.value',
            operator : 'eq',
            value : 'here'
        }
    ])).toBe(true);
    expect(instance.evaluate(facts, [
        {
            input : '$.hello',
            operator : 'eq',
            value : 'world'
        },
        {
            input : '$.deeper.value',
            operator : 'eq',
            value : 'oops'
        }
    ])).toBe(false);

    done();
};

const inequalityTest = (done) => {
    expect(instance.evaluate(facts, [
        {
            input : '$.hello',
            operator : 'ne',
            value : 'doot'
        },
        {
            input : '$.deeper.value',
            operator : 'ne',
            value : 'woot'
        }
    ])).toBe(true);
    expect(instance.evaluate(facts, [
        {
            input : '$.hello',
            operator : 'ne',
            value : 'world'
        },
        {
            input : '$.deeper.value',
            operator : 'eq',
            value : 'here'
        }
    ])).toBe(false);

    done();
};

const containsTest = (done) => {
    expect(instance.evaluate(facts, [
        {
            input : '$.hello',
            operator : 'contains',
            value : 'wo'
        },
        {
            input : '$.deeper.value',
            operator : 'contains',
            value : 're'
        }
    ])).toBe(true);
    expect(instance.evaluate(facts, [
        {
            input : '$.hello',
            operator : 'contains',
            value : 'not this'
        },
        {
            input : '$.deeper.value',
            operator : 'contains',
            value : 're'
        }
    ])).toBe(false);

    done();
};

const doesNotContainTest = (done) => {
    expect(instance.evaluate(facts, [
        {
            input : '$.hello',
            operator : 'does not contain',
            value : 'not this'
        },
        {
            input : '$.deeper.value',
            operator : 'does not contain',
            value : 'or this'
        }
    ])).toBe(true);
    expect(instance.evaluate(facts, [
        {
            input : '$.hello',
            operator : 'does not contain',
            value : 'wo'
        },
        {
            input : '$.deeper.value',
            operator : 'does not contain',
            value : 'er'
        }
    ])).toBe(false);

    done();
};

const greaterThanTest = (done) => {
    expect(instance.evaluate(facts, [
        {
            input : '$.number',
            operator : 'gt',
            value : 2
        },
        {
            input : '$.deeper.number',
            operator : 'gt',
            value : 40
        }
    ])).toBe(true);
    expect(instance.evaluate(facts, [
        {
            input : '$.hello',
            operator : 'gt',
            value : 4
        },
        {
            input : '$.deeper.value',
            operator : 'gt',
            value : 40
        }
    ])).toBe(false);

    done();
};

const lessThanTest = (done) => {
    expect(instance.evaluate(facts, [
        {
            input : '$.number',
            operator : 'lt',
            value : 4
        },
        {
            input : '$.deeper.number',
            operator : 'lt',
            value : 43
        }
    ])).toBe(true);
    expect(instance.evaluate(facts, [
        {
            input : '$.hello',
            operator : 'lt',
            value : 3
        },
        {
            input : '$.deeper.value',
            operator : 'lt',
            value : 43
        }
    ])).toBe(false);

    done();
};

const greaterThanEqualTest = (done) => {
    expect(instance.evaluate(facts, [
        {
            input : '$.number',
            operator : 'gte',
            value : 3
        },
        {
            input : '$.deeper.number',
            operator : 'gte',
            value : 42
        }
    ])).toBe(true);
    expect(instance.evaluate(facts, [
        {
            input : '$.hello',
            operator : 'gte',
            value : 4
        },
        {
            input : '$.deeper.value',
            operator : 'gte',
            value : 40
        }
    ])).toBe(false);

    done();
};

const lessThanEqualTest = (done) => {
    expect(instance.evaluate(facts, [
        {
            input : '$.number',
            operator : 'lte',
            value : 3
        },
        {
            input : '$.deeper.number',
            operator : 'lte',
            value : 42
        }
    ])).toBe(true);
    expect(instance.evaluate(facts, [
        {
            input : '$.hello',
            operator : 'lte',
            value : 2
        },
        {
            input : '$.deeper.value',
            operator : 'lte',
            value : 44
        }
    ])).toBe(false);

    done();
};

const isNullTest = (done) => {
    expect(instance.evaluate(facts, [
        {
            input : '$.isnull',
            operator : 'is null'
        },
        {
            input : '$.deeper.isnull',
            operator : 'is null'
        }
    ])).toBe(true);
    expect(instance.evaluate(facts, [
        {
            input : '$.hello',
            operator : 'is null'
        },
        {
            input : '$.deeper.isnull',
            operator : 'is null'
        }
    ])).toBe(false);

    done();
};

const isNotNullTest = (done) => {
    expect(instance.evaluate(facts, [
        {
            input : '$.hello',
            operator : 'is not null'
        },
        {
            input : '$.deeper.value',
            operator : 'is not null'
        }
    ])).toBe(true);
    expect(instance.evaluate(facts, [
        {
            input : '$.isnull',
            operator : 'is not null'
        },
        {
            input : '$.deeper.value',
            operator : 'is not null'
        }
    ])).toBe(false);

    done();
};

const missingValueTest = (done) => {
    expect(instance.evaluate(facts, [
        {
            input : '$.notthere',
            operator : 'eq',
            value : '$.notthere'
        }
    ])).toBe(true);

    done();
};

const unknownOperatorsTest = (done) => {
    expect(instance.evaluate(facts, [
        {
            input : '$.notthere',
            operator : 'what is this?',
            value : '$.notthere'
        },
        {
            input : '$.notthere',
            operator : 'what is this?',
            value : '$.notthere'
        }
    ])).toBe(false);

    done();
};

describe('A comparitor service', () => {
    it('supports equality', equalityTest);
    it('supports inequality', inequalityTest);
    it('supports contains', containsTest);
    it('supports does not contain', doesNotContainTest);
    it('supports greater than', greaterThanTest);
    it('supports less than', lessThanTest);
    it('supports greater than or equal', greaterThanEqualTest);
    it('supports less than or equal', lessThanEqualTest);
    it('supports is null', isNullTest);
    it('supports is not null', isNotNullTest);

    it('handles missing values', missingValueTest);
    it('handles unknown operators', unknownOperatorsTest);
});