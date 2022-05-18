const argParser = require('../../../src/service.kernel/lib/argParser');

const argParserTest = (done) => {
    const instance = argParser();
    process.argv = [
        '--boolean',
        '--string=this',
        '--array=1',
        '--array=2',
        '--check=we=can=have=more=than=one',
        '--object.propOne=hello',
        '--object.propTwo=world',
        '--object.propOne.ignore=nice',
        'ignore'
    ];

    expect(instance.fetch()).toEqual({
        boolean : true,
        string 	: 'this',
        array 	: ['1', '2'],
        check 	: 'we=can=have=more=than=one',
        object 	: {
            propOne : 'hello',
            propTwo : 'world'
        }
    });

    done();
};

describe('An arg parser', () => {
    it('can fetch arguments correctly', argParserTest);
});