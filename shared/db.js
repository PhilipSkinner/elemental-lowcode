module.exports = function(sequelize, path) {  
  if (!sequelize) {
    sequelize = require('sequelize');
  }

  if (!path) {
    path = require('path');
  }
    
  const db = new sequelize({
    dialect: 'sqlite',
    storage: path.join(process.env.DIR, 'db.sqlite'),
    logging: false
  });

  const grantable = new Set([
    'AccessToken',
    'AuthorizationCode',
    'RefreshToken',
    'DeviceCode',
  ]);

  const models = [
    'Session',
    'AccessToken',
    'AuthorizationCode',
    'RefreshToken',
    'DeviceCode',
    'ClientCredentials',
    'Client',
    'InitialAccessToken',
    'RegistrationAccessToken',
    'Interaction',
    'ReplayDetection',
    'PushedAuthorizationRequest',
    'User'
  ].reduce((map, name) => {
    map.set(name, db.define(name, {
      id: { type: sequelize.STRING, primaryKey: true },
      ...(grantable.has(name) ? { grantId: { type: sequelize.STRING } } : undefined),
      ...(name === 'DeviceCode' ? { userCode: { type: sequelize.STRING } } : undefined),
      ...(name === 'Session' ? { uid: { type: sequelize.STRING } } : undefined),
      data: { type: sequelize.JSONB },
      expiresAt: { type: sequelize.DATE },
      consumedAt: { type: sequelize.DATE },
    }));

    return map;
  }, new Map());

  class SequelizeAdapter {
    constructor(name) {
      this.model = models.get(name);
      this.name = name;
    }

    async upsert(id, data, expiresIn) {
      await this.model.upsert({
        id,
        data,
        ...(data.grantId ? { grantId: data.grantId } : undefined),
        ...(data.userCode ? { userCode: data.userCode } : undefined),
        ...(data.uid ? { uid: data.uid } : undefined),
        ...(expiresIn ? { expiresAt: new Date(Date.now() + (expiresIn * 1000)) } : undefined),
      });
    }

    async fetch() {
      return await this.model.findAll();
    }

    async find(id) {
      const found = await this.model.findByPk(id);
      if (!found) return undefined;

      let ret = {
        ...found.data,
        ...(found.consumedAt ? { consumed: true } : undefined),
      };      

      return ret;
    }

    async findByUserCode(userCode) {
      const found = await this.model.findOne({ where: { userCode } });
      if (!found) return undefined;
      return {
        ...found.data,
        ...(found.consumedAt ? { consumed: true } : undefined),
      };
    }

    async findByUid(uid) {
      const found = await this.model.findOne({ where: { uid } });
      if (!found) return undefined;
      return {
        ...found.data,
        ...(found.consumedAt ? { consumed: true } : undefined),
      };
    }

    async destroy(id) {
      await this.model.destroy({ where: { id } });
    }

    async consume(id) {
      await this.model.update({ consumedAt: new Date() }, { where: { id } });
    }

    async revokeByGrantId(grantId) {
      await this.model.destroy({ where: { grantId } });
    }

    static async connect() {
      return db.sync();
    }
  }

  return SequelizeAdapter;
};