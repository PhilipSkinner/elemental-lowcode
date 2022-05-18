const
    sinon 				= require('sinon'),
    roleCheckHandler 	= require('../../src/support.lib/roleCheckHandler');

const _generateToken = (header, body, sig) => {
    return [
        Buffer.from(JSON.stringify(header)).toString('base64'),
        Buffer.from(JSON.stringify(body)).toString('base64'),
        sig
    ].join('.');
};

const enforceRolesTest = (done) => {
    const instance = roleCheckHandler();

    instance.enforceRoles(() => {
        done();
    }, ['an_role'])({
        headers : {
            authorization : 'Bearer ' + _generateToken({}, { role : 'an_role' })
        }
    }, {

    });
};

const multipleRolesTest = (done) => {
    const instance = roleCheckHandler();

    instance.enforceRoles(() => {
        done();
    }, ['an_role'])({
        headers : {
            authorization : 'Bearer ' + _generateToken({}, { role : ['another_role','an_role'] })
        }
    }, {

    });
};

const rolesClaimTest = (done) => {
    const instance = roleCheckHandler();

    instance.enforceRoles(() => {
        done();
    }, ['an_role'])({
        headers : {
            authorization : 'Bearer ' + _generateToken({}, { roles : ['another_role','an_role'] })
        }
    }, {

    });
};

const sessionTokenTest = (done) => {
    const instance = roleCheckHandler();

    instance.enforceRoles(() => {
        done();
    }, ['an_role'])({
        headers : {},
        session : {
            passport : {
                user : {
                    accessToken : _generateToken({}, { role : 'an_role' })
                }
            }
        }
    }, {

    });
};

const missingTokenTest = (done) => {
    const instance = roleCheckHandler();

    instance.enforceRoles(() => {

    }, ['an_role'])({
        headers : {}
    }, {
        status : (code) => {
            expect(code).toEqual(403);
        },
        end : () => {
            done();
        }
    });
};

const noRequiredRolesTest = (done) => {
    const instance = roleCheckHandler();

    instance.enforceRoles(() => {
        done();
    }, null)({
        headers : {
            authorization : 'Bearer ' + _generateToken({}, { roles : ['another_role','an_role'] })
        }
    }, {

    });
};

const tokenNoRolesTest = (done) => {
    const instance = roleCheckHandler();

    instance.enforceRoles(() => {

    }, ['an_role'])({
        headers : {
            authorization : 'Bearer ' + _generateToken({}, { })
        }
    }, {
        status : (code) => {
            expect(code).toEqual(403);
        },
        end : () => {
            done();
        }
    });
};

const tokenMismatchTest = (done) => {
    const instance = roleCheckHandler();

    instance.enforceRoles(() => {

    }, ['the_role'])({
        headers : {
            authorization : 'Bearer ' + _generateToken({}, { roles : 'a_different_role' })
        }
    }, {
        status : (code) => {
            expect(code).toEqual(403);
        },
        end : () => {
            done();
        }
    });
};

describe('A controller role check handler', () => {
	it('enforces roles', enforceRolesTest);
    it('supports multiple roles', multipleRolesTest);
    it('supports the roles claim', rolesClaimTest);
    it('supports tokens from the users session', sessionTokenTest);
    it('handles missing tokens', missingTokenTest);
    it('handles no required roles', noRequiredRolesTest);
    it('handles token with no roles', tokenNoRolesTest);
    it('handles token mismatches', tokenMismatchTest);
});