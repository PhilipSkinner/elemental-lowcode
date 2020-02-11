module.exports = function(db) {
  if (!db) {
    db = require('./db')();
  }

  const userDB = new db("User");

  class Account {
    constructor(id, profile) {
      this.accountId = id;
      this.profile = profile;      
    }    

    async claims(use, scope) {
      return Object.assign(this.profile.claims, {
        sub : this.accountId
      });      
    }

    static async findByLogin(login, password) {
      const user = await userDB.find(login);

      if (typeof(user) === 'undefined' || user === null) {
        return null;
      }      

      if (user.password !== password) {
        return null;
      }      

      return new Account(login, user);
    }

    static async findAccount(ctx, id, token) {       
      const user = await userDB.find(id);
      return new Account(id, user);
    }

    static async extraAccessTokenClaims(ctx, token) {      
      const user = await userDB.find(token.accountId);

      if (!user) {
        return {};
      }

      return {
        roles : user.claims.roles
      };        
    }

    static async registerUser(username, password) {
      await userDB.upsert(username, {
        password : password,
        claims : {
          roles : [
            "system_admin"
          ]
        }
      });

      return await userDB.find(username);
    }
  }

  return Account;
}