const
    sinon           = require('sinon'),
    readLastLines   = require('../../../src/service.kernel/lib/readLastLines');

const fs = {
    readFile : () => {}
};

const constructorTest = (done) => {
    const instance = readLastLines();
    expect(instance.fs).not.toBe(null);
    done();
};

const readErrorTest = (done) => {
    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my-path').callsArgWith(1, new Error('didnt work'));

    const instance = readLastLines(fs);

    instance.read('my-path', 5).catch((err) => {
        expect(err).toEqual(new Error('didnt work'));

        fsMock.verify();

        done();
    });
};

const readTest = (done) => {
    const fsMock = sinon.mock(fs);
    fsMock.expects('readFile').once().withArgs('my-path').callsArgWith(1, null, "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n");

    const instance = readLastLines(fs);

    instance.read('my-path', 5).then((lines) => {
        expect(lines).toEqual({
            5 : "6",
            6 : "7",
            7 : "8",
            8 : "9",
            9 : "10"
        });

        fsMock.verify();

        done();
    });
};

describe('A read last line provider', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('read', () => {
        it('handles read errors', readErrorTest);
        it('works', readTest);
    });
});