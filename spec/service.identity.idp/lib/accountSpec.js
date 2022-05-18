const
    sinon 			= require('sinon'),
    account 		= require('../../../src/service.identity.idp/lib/account');

const _db = {
    find 			: () => {},
    findByUsername 	: () => {},
    upsert 			: () => {}
};

class db {
    constructor() {

    }

    async find(name) {
        return _db.find(name);
    }

    async findByUsername(name) {
        return _db.findByUsername(name);
    }

    async upsert(name, data) {
        return _db.upsert(name, data);
    }
}

const bcrypt = {
    compare : () => {},
    hash : () => {}
};

const defaultsTest = (done) => {
    const instance = account(db, null);

    done();
};

const scopeIssueTest = (done) => {
    const instance = account(db, bcrypt);

    let user = new instance('1234', {
        claims : {
            hello : 'world'
        }
    });

    user.claims().then((result) => {
        expect(result).toEqual({
            hello : 'world',
            sub : '1234'
        });

        done();
    });
};

const issueClaimsNoClaimsTest = (done) => {
    const instance = account(db, bcrypt);

    let user = new instance('1234', {});

    user.claims().then((result) => {
        expect(result).toEqual({
            sub : '1234'
        });

        done();
    });
};

const userExistsTest = (done) => {
    const instance = account(db, bcrypt);

    const dbMock = sinon.mock(_db);
    dbMock.expects('findByUsername').once().withArgs('hello').returns(Promise.resolve(null));

    instance.findByLogin('hello', 'world').then((result) => {
        expect(result).toBe(null);

        dbMock.verify();
        dbMock.restore();

        done();
    });
};

const userPasswordIncorrect = (done) => {
    const instance = account(db, bcrypt);

    const dbMock = sinon.mock(_db);
    dbMock.expects('findByUsername').once().withArgs('hello').returns(Promise.resolve({
        password : 'doot'
    }));

    const bcryptMock = sinon.mock(bcrypt);
    bcryptMock.expects('compare').once().withArgs('world', 'doot').callsArgWith(2, null, false);

    instance.findByLogin('hello', 'world').then((result) => {
        expect(result).toBe(null);

        dbMock.verify();
        dbMock.restore();
        bcryptMock.verify();
        bcryptMock.restore();

        done();
    });
};

const userPasswordCorrect = (done) => {
    const instance = account(db, bcrypt);

    const dbMock = sinon.mock(_db);
    dbMock.expects('findByUsername').once().withArgs('hello').returns(Promise.resolve({
        password : 'doot'
    }));

    const bcryptMock = sinon.mock(bcrypt);
    bcryptMock.expects('compare').once().withArgs('world', 'doot').callsArgWith(2, null, true);

    instance.findByLogin('hello', 'world').then((result) => {
        expect(result.profile.password).toEqual('doot');

        dbMock.verify();
        dbMock.restore();
        bcryptMock.verify();
        bcryptMock.restore();

        done();
    });
};

const userPasswordErrors = (done) => {
    const instance = account(db, bcrypt);

    const dbMock = sinon.mock(_db);
    dbMock.expects('findByUsername').once().withArgs('hello').returns(Promise.resolve({
        password : 'doot'
    }));

    const bcryptMock = sinon.mock(bcrypt);
    bcryptMock.expects('compare').once().withArgs('world', 'doot').callsArgWith(2, new Error('oops'));

    instance.findByLogin('hello', 'world').catch((err) => {
        expect(err).toEqual(new Error('oops'));

        dbMock.verify();
        dbMock.restore();
        bcryptMock.verify();
        bcryptMock.restore();

        done();
    });
};

const findById = (done) => {
    const instance = account(db, bcrypt);

    const dbMock = sinon.mock(_db);
    dbMock.expects('find').once().withArgs('hello').returns(Promise.resolve({}));

    instance.findAccount(null, 'hello').then((result) => {
        expect(result.accountId).toEqual('hello');

        dbMock.verify();
        dbMock.restore();

        done();
    });
};

const extraClaimsUserTest = (done) => {
    const instance = account(db, bcrypt);

    const dbMock = sinon.mock(_db);
    dbMock.expects('find').once().withArgs('hello').returns(Promise.resolve({
        claims : {
            roles : ['hello', 'world']
        }
    }));

    instance.extraAccessTokenClaims([])(null, {
        accountId : 'hello'
    }).then((result) => {
        expect(result.roles).toEqual(['hello', 'world']);

        dbMock.verify();
        dbMock.restore();

        done();
    });
};

const extraClaimsUserNotFound = (done) => {
    const instance = account(db, bcrypt);

    const dbMock = sinon.mock(_db);
    dbMock.expects('find').once().withArgs('hello').returns(Promise.resolve(null));

    instance.extraAccessTokenClaims([])(null, {
        accountId : 'hello'
    }).then((result) => {
        expect(result).toEqual({});

        dbMock.verify();
        dbMock.restore();

        done();
    });
};

const extraClaimsClientTest = (done) => {
    const instance = account(db, bcrypt);

    instance.extraAccessTokenClaims([
        {
            client_id : 'doot',
            roles : ['hello', 'world']
        }
    ])(null, {
        clientId : 'doot',
        kind : 'ClientCredentials'
    }).then((result) => {
        expect(result.roles).toEqual(['hello', 'world']);

        done();
    });
};

const extraClaimsClientNotFound = (done) => {
    const instance = account(db, bcrypt);

    instance.extraAccessTokenClaims([
        {
            client_id : 'doot',
            roles : ['hello', 'world']
        }
    ])(null, {
        clientId : 'woot',
        kind : 'ClientCredentials'
    }).then((result) => {
        expect(result).toEqual({});

        done();
    });
};

const extraClaimsInvalidTest = (done) => {
    const instance = account(db, bcrypt);

    instance.extraAccessTokenClaims([
        {
            client_id : 'doot',
            roles : ['hello', 'world']
        }
    ])(null, {
    }).then((result) => {
        expect(result).toEqual({});

        done();
    });
};

const passwordGenTest = (done) => {
    const instance = account(db, bcrypt);

    const bcryptMock = sinon.mock(bcrypt);
    bcryptMock.expects('hash').once().withArgs('doot', 10).callsArgWith(2, null, 'hashed doot');

    instance.generatePassword('doot').then((result) => {
        expect(result).toEqual('hashed doot');

        bcryptMock.verify();
        bcryptMock.restore();

        done();
    });
};

const passwordGenErrorTest = (done) => {
    const instance = account(db, bcrypt);

    const bcryptMock = sinon.mock(bcrypt);
    bcryptMock.expects('hash').once().withArgs('doot', 10).callsArgWith(2, new Error('oh dear'));

    instance.generatePassword('doot').catch((err) => {
        expect(err).toEqual(new Error('oh dear'));

        bcryptMock.verify();
        bcryptMock.restore();

        done();
    });
};

const registerConflictTest = (done) => {
    const instance = account(db, bcrypt);

    const dbMock = sinon.mock(_db);
    dbMock.expects('findByUsername').once().withArgs('doot').returns(Promise.resolve('oh dear'));

    instance.registerUser('doot').then((result) => {
        expect(result).toBe(null);

        dbMock.verify();
        dbMock.restore();

        done();
    });
};

const registerTest = (done) => {
    const instance = account(db, bcrypt);

    const dbMock = sinon.mock(_db);
    dbMock.expects('findByUsername').once().withArgs('doot').returns(Promise.resolve(null));
    dbMock.expects('upsert').once().withArgs(sinon.match.any, {
        username : 'doot',
        password : 'hashed woot',
        registered : sinon.match.any,
        claims : {
            roles : []
        },
        subject : sinon.match.any
    }).returns(Promise.resolve('nice'));
    dbMock.expects('find').once().withArgs(sinon.match.any).returns(Promise.resolve({
        hello : 'world'
    }));

    const bcryptMock = sinon.mock(bcrypt);
    bcryptMock.expects('hash').once().withArgs('woot', 10).callsArgWith(2, null, 'hashed woot');

    instance.registerUser('doot', 'woot').then((result) => {
        expect(result).toEqual({
            hello : 'world'
        });

        dbMock.verify();
        dbMock.restore();
        bcryptMock.verify();
        bcryptMock.restore();

        done();
    });
};

describe('An account provider', () => {
    it('defaults its constructor args', defaultsTest);
    it('can issue claims based upon the scope', scopeIssueTest);
    it('can issue claims for a user with no claims', issueClaimsNoClaimsTest);
    it('can determine if a user exists', userExistsTest);
    it('can determine if the password is incorrect', userPasswordIncorrect);
    it('can determine if the password is correct', userPasswordCorrect);
    it('can check passwords, handling errors', userPasswordErrors);
    it('can find accounts by id', findById);
    it('can issue extra claims for users', extraClaimsUserTest);
    it('can issue extra claims for not found users', extraClaimsUserNotFound);
    it('can issue extra claims for clients', extraClaimsClientTest);
    it('can issue extra claims for not found clients', extraClaimsClientNotFound);
    it('can issue extra claims, ignoring invalid requests', extraClaimsInvalidTest);
    it('can check passwords, handling errors', userPasswordErrors);
    it('can generate passwords correctly', passwordGenTest);
    it('can generate passwords, handling errors', passwordGenErrorTest);
    it('can register users, detecting conflict', registerConflictTest);
    it('can register users correctly', registerTest);
});