module.exports = function(db, bcrypt) {
  if (!db) {
    db = require('../../shared/db')();
  }

  if (!bcrypt) {
    bcrypt = require('bcrypt');
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

      const isMatch = await Account.checkPassword(user.password, password);
      if (!isMatch) {
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

    static async checkPassword(hashed, plain) {
      return new Promise((resolve, reject) => {
        bcrypt.compare(plain, hashed, (err, result) => {
          if (err) {
            return reject(err);
          }

          return resolve(result);
        });
      });
    }

    static async generatePassword(plain) {
      return new Promise((resolve, reject) => {
        bcrypt.hash(plain, 10, (err, hash) => {
          if (err) {
            return reject(err);
          }

          return resolve(hash);
        })
      });
    }

    static async registerUser(username, password) {
      const hashed = await Account.generatePassword(password);

      await userDB.upsert(username, {
        username    : username,
        password    : hashed,
        registered  : new Date(),
        claims      : {
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