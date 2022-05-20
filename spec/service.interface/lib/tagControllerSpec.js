const
    sinon 		  = require('sinon'),
    tagController = require('../../../src/service.interface/lib/tagControllers');

const path = {
    join : () => {}
};

const constructorTest = (done) => {
    const instance = tagController();

    expect(instance.path).not.toBe(undefined);
    expect(instance.path).not.toBe(null);

    done();
};

const registerNullName = (done) => {
    const instance = tagController(path);

    expect(() => {
        instance.registerController('');
    }).toThrow(new Error('Registering a controller requires a name'));

    done();
};

const registerTest = (done) => {
    const instance = tagController(path);

    instance.registerController('name', 'controller', 'raw');

    expect(instance.controllers.name).toEqual({
        controller : 'controller',
        name : 'name',
        raw : 'raw'
    });

    done();
};

const provideInstanceRaw = (done) => {
    const instance = tagController(path);

    instance.registerController('name', '2 * 3', 1);

    expect(instance.provideInstance('name')).toEqual(6);

    done();
};

const provideInstancePath = (done) => {
    const instance = tagController(path);

    instance.registerController('name', 'my-module', 0);

    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(process.cwd(), sinon.match.any, 'my-module').returns('fs');

    expect(instance.provideInstance('name')).toEqual(require('fs'));

    pathMock.verify();

    done();
};

const determineInstancesNotArray = (done) => {
    const instance = tagController(path);

    instance.registerController('name', '2 * 3', 1);
    
    expect(instance.determineInstances({
        tag : 'name'
    })).toEqual([
        {
            identifier : 'controller_name_1',
            instance : 6
        }
    ]);

    done();
};

const determineInstancesArray = (done) => {
        const instance = tagController(path);

    instance.registerController('name', '2 * 3', 1);
    
    expect(instance.determineInstances([
        {
            tag : 'name'
        }
    ])).toEqual([
        {
            identifier : 'controller_name_1',
            instance : 6
        }
    ]);

    done();
};

describe('A tag controller', () => {
    it('supports constructor defaulting', constructorTest);

    describe('can register a controller', () => {
        it('with a null name', registerNullName);
        it('correctly', registerTest);
    });

    describe('can provide an instance', () => {
        it('using raw code', provideInstanceRaw);
        it('using a path', provideInstancePath);
    });

    describe('can determine tag instances from view', () => {
        it('handling none array views', determineInstancesNotArray);
        it('handling array views', determineInstancesArray);
    });
});