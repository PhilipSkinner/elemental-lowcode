const
    sinon     = require('sinon'),
    sqlStore  = require('../../../src/support.lib/stores/sqlStore');

const sequelize = {
    BOOLEAN : 1,
    INTEGER : 2,
    DECIMAL : 3,
    DATE    : 4,
    TEXT    : 5
};

const uuid = {

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

describe('A sql store', () => {
    describe('determine type', () => {
        it('can determine booleans', determineBooleansTest);
        it('can determine integers', determineIntegersTest);
        it('can determine numbers', determineNumbersTest);
        it('can determine decimals', determineDecimalsTest);
        it('can determine date times', determineDateTimeTest);
        it('defaults to text', determineDefaultTest);
    });
});