const
    jasmine 		= require('jasmine'),
    sinon 			= require('sinon'),
    hotReload 		= require('../../src/support.lib/hotReload');

const chokidar = {};

const constructorTest = (done) => {
    const instance = hotReload();
    expect(instance.chokidar).not.toBe(null);
    done();
};

const launchTest = (done) => {
    const instance = hotReload(chokidar);

    instance.attemptLaunch(() => {
        done();
    }, () => {
        expect(1).toEqual(2);

        done();
    });
};

const launchFailureTest = (done) => {
    const instance = hotReload(chokidar);

    let launchNum = 0;

    instance.attemptLaunch(() => {
        launchNum++;

        if (launchNum == 1) {
            throw new Error('oh noes');
        }

        expect(launchNum).toEqual(2);

        done();
    }, () => {
        expect(launchNum).toEqual(1);
    });
};

describe('A hot reload provider', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('can attempt a launch', () => {
        it('successfully', launchTest);
        it('pausing between failures', launchFailureTest);
    });
});