const
    sinon = require('sinon'),
    sessionState = require('../../../src/service.interface/lib/sessionState');

const request = {
    cookies: {},
    session: {
        destroy: () => {
            request.session = null;
        }
    }
};

const response = {

};

const constructorTest = (done) => {
    const instance = sessionState();
    expect(instance.sessionName).toEqual('__session');
    done();
};

const lifecycleTest = (done) => {
    const instance = sessionState();

    instance.setContext(request, response);
    instance.setAccessToken('access token');
    instance.setIdentityToken('identity token');
    instance.setRefreshToken('refresh token');

    expect(instance.getSubject()).toBe(null);
    expect(instance.getAccessToken()).toEqual('access token');
    expect(instance.getIdentityToken()).toEqual('identity token');
    expect(instance.getRefreshToken()).toEqual('refresh token');
    expect(instance.isAuthenticated()).toEqual(true);

    //wipe the session
    instance.wipeSession();

    expect(instance.getSubject()).toBe(null);
    expect(instance.getAccessToken()).toBe(null);
    expect(instance.getIdentityToken()).toBe(null);
    expect(instance.getRefreshToken()).toBe(null);
    expect(instance.isAuthenticated()).toEqual(false);

    instance.setContext(request, response);
    instance.setAccessToken('access token');
    instance.setIdentityToken('identity token');
    instance.setRefreshToken('refresh token');

    expect(instance.getSubject()).toBe(null);
    expect(instance.getAccessToken()).toEqual('access token');
    expect(instance.getIdentityToken()).toEqual('identity token');
    expect(instance.getRefreshToken()).toEqual('refresh token');
    expect(instance.isAuthenticated()).toEqual(true);

    //deallocate should do the same thing
    instance.deallocate();
    expect(instance.getSubject()).toBe(null);
    expect(instance.getAccessToken()).toBe(null);
    expect(instance.getIdentityToken()).toBe(null);
    expect(instance.getRefreshToken()).toBe(null);
    expect(instance.isAuthenticated()).toEqual(false);

    //can parse tokens
    instance.setContext(request, response);
    instance.setAccessToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
    expect(instance.getSubject()).toEqual('1234567890');

    //can save session data
    expect(instance.retrieveSession()).toBe(null);
    request.cookies.__session = Buffer.from(JSON.stringify('doot')).toString('base64');
    expect(instance.retrieveSession()).toEqual('doot');
    instance.saveSession('woot');
    expect(instance.retrieveSession()).toEqual('woot');

    done();
};

const nullContextTest = (done) => {
    const instance = sessionState();

    instance.setAccessToken('access token');
    instance.setIdentityToken('identity token');
    instance.setRefreshToken('refresh token');

    expect(instance.getSubject()).toBe(null);
    expect(instance.getAccessToken()).toEqual('access token');
    expect(instance.getIdentityToken()).toEqual('identity token');
    expect(instance.getRefreshToken()).toEqual('refresh token');
    expect(instance.isAuthenticated()).toEqual(true);

    instance.wipeSession();
    instance.generateResponseHeaders();

    done();
};

const hasRoleMatchesTest = (done) => {
    const instance = sessionState();

    instance.setAccessToken(`ignore.${Buffer.from(JSON.stringify({ role: ['role1'], roles: "role2" })).toString('base64')}.ignore`);
    expect(instance.hasRole('role1')).toEqual(true);

    done();
}

const hasRoleNoMatchingRoleTest = (done) => {
    const instance = sessionState();

    instance.setAccessToken(`ignore.${Buffer.from(JSON.stringify({ role: ['role1'], roles: "role2" })).toString('base64')}.ignore`);
    expect(instance.hasRole('role3')).toEqual(false);

    done();
}

const hasRoleNullMatchingRoleTest = (done) => {
    const instance = sessionState();

    instance.setAccessToken(`ignore.${Buffer.from(JSON.stringify({ role: ['role1']})).toString('base64')}.ignore`);
    expect(instance.hasRole(null)).toEqual(false);

    done();
}

const hasRoleUndefinedMatchingRoleTest = (done) => {
    const instance = sessionState();

    instance.setAccessToken(`ignore.${Buffer.from(JSON.stringify({roles : ['role1']})).toString('base64')}.ignore`);
    expect(instance.hasRole(undefined)).toEqual(false);

    done();
}

const hasOneRoleMatchesTest = (done) => {
    const instance = sessionState();

    instance.setAccessToken(`ignore.${Buffer.from(JSON.stringify({ role: 'role2', roles: ['role3', "role4"] })).toString('base64')}.ignore`);
    expect(instance.hasAtleastOneRole(['role1', 'role2'])).toEqual(true);

    done();
}

const hasOneRoleNoMatchingRoleTest = (done) => {
    const instance = sessionState();

    instance.setAccessToken(`ignore.${Buffer.from(JSON.stringify({ role: 'role1', roles: ['role3', "role4"] })).toString('base64')}.ignore`);
    expect(instance.hasAtleastOneRole(['role2', 'role5'])).toEqual(false);

    done();
}

const hasOneRoleNullMatchingRoleTest = (done) => {
    const instance = sessionState();

    instance.setAccessToken(`ignore.${Buffer.from(JSON.stringify({ role:['role1', 'role2'] })).toString('base64')}.ignore`);
    expect(instance.hasAtleastOneRole(null)).toEqual(false);

    done();
}

const hasOneRoleUndefinedMatchingRoleTest = (done) => {
    const instance = sessionState();

    instance.setAccessToken(`ignore.${Buffer.from(JSON.stringify({ roles : ['role1', 'role2']})).toString('base64')}.ignore`);
    expect(instance.hasAtleastOneRole(undefined)).toEqual(false);

    done();
}

const hasOneRoleNotArrayMatchingRoleTest = (done) => {
    const instance = sessionState();

    instance.setAccessToken(`ignore.${Buffer.from(JSON.stringify({ roles : ['role1', 'role2']})).toString('base64')}.ignore`);
    expect(instance.hasAtleastOneRole({role : "role1"})).toEqual(false);

    done();
}

const hasOneRoleEmptyArrayMatchingRoleTest = (done) => {
    const instance = sessionState();

    instance.setAccessToken(`ignore.${Buffer.from(JSON.stringify({ roles: []})).toString('base64')}.ignore`);
    expect(instance.hasAtleastOneRole([])).toEqual(true);

    done();
}

const hasAllRolesMatchesTest = (done) => {
    const instance = sessionState();

    instance.setAccessToken(`ignore.${Buffer.from(JSON.stringify({ role: 'role3' ,roles: ['role1', 'role2'] })).toString('base64')}.ignore`);
    expect(instance.hasAllRoles(['role2', "role3"])).toEqual(true);

    done();
}

const hasAllRolesNoMatchingRoleTest = (done) => {
    const instance = sessionState();

    instance.setAccessToken(`ignore.${Buffer.from(JSON.stringify({ role: 'role3' ,roles: ['role1', 'role2']})).toString('base64')}.ignore`);
    expect(instance.hasAllRoles(['role1', 'role2', "role3", "role4"])).toEqual(false);


    done();
}

const hasAllRolesNullMatchingRoleTest = (done) => {
    const instance = sessionState();

    instance.setAccessToken(`ignore.${Buffer.from(JSON.stringify({ role: ['role1', 'role2']})).toString('base64')}.ignore`);
    expect(instance.hasAllRoles(null)).toEqual(false);

    done();
}

const hasAllRolesUndefinedMatchingRoleTest = (done) => {
    const instance = sessionState();

    instance.setAccessToken(`ignore.${Buffer.from(JSON.stringify({ roles : ['role1', 'role2']})).toString('base64')}.ignore`);
    expect(instance.hasAllRoles(undefined)).toEqual(false);

    done();
}

const hasAllRolesNotArrayMatchingRoleTest = (done) => {
    const instance = sessionState();

    instance.setAccessToken(`ignore.${Buffer.from(JSON.stringify({ roles : ['role1', 'role2']})).toString('base64')}.ignore`);
    expect(instance.hasAllRoles({role : "role1"})).toEqual(false);

    done();
}

const hasAllRolesEmptyArrayMatchingRoleTest = (done) => {
    const instance = sessionState();

    instance.setAccessToken(`ignore.${Buffer.from(JSON.stringify({ roles: ["role1"]})).toString('base64')}.ignore`);
    expect(instance.hasAllRoles([])).toEqual(true);

    done();
}

describe('A session state service', () => {
    it('defaults its constructor arguments', constructorTest);
    it('can handle all lifecycle events correctly', lifecycleTest);
    it('can handle null contexts', nullContextTest);

    describe('has role', () => {
        it('returns false when the user does not have the role', hasRoleNoMatchingRoleTest);
        it('returns true when the user does have the role', hasRoleMatchesTest);
        it('returns false when role is null', hasRoleNullMatchingRoleTest);
        it('returns false when role is undefined', hasRoleUndefinedMatchingRoleTest)
    });

    describe('has atleast one role', () => {
        it('returns false when the user does not have atleast one role', hasOneRoleNoMatchingRoleTest);
        it('returns true when the user does have any role', hasOneRoleMatchesTest);
        it('returns false when roles is null', hasOneRoleNullMatchingRoleTest);
        it('returns false when roles is undefined', hasOneRoleUndefinedMatchingRoleTest);
        it('returns false when roles is not an array', hasOneRoleNotArrayMatchingRoleTest);
        it('returns true when roles is an empty array', hasOneRoleEmptyArrayMatchingRoleTest);

    });

    describe('has all the roles', () => {
        it('returns false when the user does not have all the roles', hasAllRolesNoMatchingRoleTest);
        it('returns true when the user does have all the roles', hasAllRolesMatchesTest);
        it('returns false when roles is null', hasAllRolesNullMatchingRoleTest);
        it('returns false when roles is undefined', hasAllRolesUndefinedMatchingRoleTest)
        it('returns false when roles is not an array', hasAllRolesNotArrayMatchingRoleTest);
        it('returns true when roles is an empty array', hasAllRolesEmptyArrayMatchingRoleTest);
    });

});