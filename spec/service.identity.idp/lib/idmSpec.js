const
    sinon 			= require('sinon'),
    idm 			= require('../../../src/service.identity.idp/lib/idm');

class db {

}

const defaultsTest = (done) => {
    const instance = idm(null, null, db);

    expect(instance.roleCheckHandler).not.toBe(null);
    expect(instance.bcrypt).not.toBe(null);
    expect(instance.tokenHandler).not.toBe(null);

    done();
};

describe('An identity manager', () => {
    it('defaults its constructor arguments', defaultsTest);
});