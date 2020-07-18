const sqlStore = function(connectionString, typeConfig, sequelize, uuid) {
	this.connectionString 	= connectionString;
	this.config 			= typeConfig;
	this.sequelize 			= sequelize;
	this.uuid 				= uuid;

	let dialect = this.connectionString.split(":")[0].toLowerCase();
	let dialectOptions = {
		collate : "utf8_general_ci",
	};

	this.connection = new this.sequelize(this.connectionString, {
		dialect : dialect,
		pool 	: {
			max			: 5,
			min			: 0,
			acquire		: 30000,
			idle		: 10000
		},
		define 	: {
			freezeTableName	: true,
			charset 		: this.connectionString.indexOf("postgres://") !== -1 ? "utf-8" : "utf8",
			dialectOptions 	: dialectOptions,
			timestamps 		: false
		},
		logging : false
	});

	this.simpleTypes = [
		"string",
		"boolean",
		"integer",
		"number",
		"datetime",
		"decimal"
	];

	this.models = {};
	this.tables = {};
	this.simpleTables = {};
	this.columnTableLookups = {};
	this.mainTable = null;
	this.isReady = false;

	this.initType().then(() => {
		this.isReady = true;
	});
};

sqlStore.prototype.determineType = function(type) {
	if (type === "boolean") {
		return this.sequelize.BOOLEAN;
	}

	if (type === "integer") {
		return this.sequelize.INTEGER;
	}

	if (type === "number" || type === "decimal") {
		return this.sequelize.DECIMAL;
	}

	if (type === "datetime") {
		return this.sequelize.DATE;
	}

	return this.sequelize.TEXT;
};

sqlStore.prototype.determineTables = function(baseName, schemaConfig, tables, parentName, originalName) {
	let columns = {};
	let normalisedBaseName = baseName.toLowerCase();
	let normalisedOriginalName = originalName.toLowerCase();

	if (schemaConfig.type === "object" || this.simpleTypes.indexOf(schemaConfig.type) !== -1) {
		//add our ID
		columns.id = {
			primaryKey 		: true,
			type 			: this.sequelize.UUID,
			allowNull 		: false
		};

		//add our parent
		if (parentName) {
			columns.parent = {
				type 		: this.sequelize.UUID,
				allowNull 	: true,
				references 	: {
					model 	: parentName,
					key 	: "id"
				}
			};
		}

		//add our ETAG
		columns.etag = {
			type 			: this.sequelize.UUID,
			allowNull 		: false,
		}

		if (this.simpleTypes.indexOf(schemaConfig.type) !== -1) {
			columns.value = {
				type 		: this.determineType(schemaConfig.type),
				allowNull 	: false
			};

			//record this as a simple type
			if (!this.simpleTables[parentName]) {
				this.simpleTables[parentName] = {
					children : []
				};
			}

			this.simpleTables[parentName].children.push(normalisedBaseName);
			this.columnTableLookups[`${parentName}@@${normalisedOriginalName}`] = normalisedBaseName;
			this.columnTableLookups[normalisedBaseName] = normalisedOriginalName;
		} else {
			Object.keys(schemaConfig.properties).forEach((propName) => {
				if (this.simpleTypes.indexOf(schemaConfig.properties[propName].type) !== -1) {
					//add the column
					columns[propName] = {
						type : this.determineType(schemaConfig.properties[propName].type)
					};

					//is it our id?
					if (propName === "id") {
						columns[propName].primaryKey = true;

						if (schemaConfig.properties[propName].type === "string") {
							columns[propName].type = this.sequelize.STRING(255);
						}
					}
				} else {
					//generate a new table
					let normName = propName.toLowerCase();
					tables = this.determineTables(`${normalisedBaseName}_${normName}`, schemaConfig.properties[propName], tables, normalisedBaseName, normName);
				}
			});
		}

		tables[normalisedBaseName] = columns;
	}

	if (schemaConfig.type === "array") {
		tables = this.determineTables(`${normalisedBaseName}`, schemaConfig.items, tables, parentName, originalName);
	}

	return tables;
};

sqlStore.prototype.initType = function() {
	return new Promise((resolve, reject) => {
		//generate our list of tables and columns
		this.tables = this.determineTables(this.config.name, this.config.schema, {}, "", this.config.name);

		const models = [];
		Object.keys(this.tables).forEach((name) => {
			const m = this.connection.define(name, this.tables[name]);
			this.models[name] = m;
			models.push(m);
		});

		//ensure we handle any fk relationships
		Object.keys(this.tables).forEach((name) => {
			if (this.tables[name].parent && this.tables[name].parent.references) {
				let childModel = this.models[name];
				let parentModel = this.models[this.tables[name].parent.references.model];

				parentModel.hasMany(childModel, {
					foreignKey : `parent`
				});
				childModel.belongsTo(parentModel, {
					foreignKey : `id`
				});
			}
		});

		this.mainTable = this.models[this.config.name];

		//execute in order
		const doNext = () => {
			if (models.length === 0) {
				return Promise.resolve();
			}

			const next = models.pop();

			return next.sync({
				force : false,
				alter : true
			}).then(doNext).catch((err) => {
				console.log(err);
				return doNext();
			});
		}

		return doNext().then(resolve).catch(reject);
	});
};

sqlStore.prototype.getDetails = function(type, parent) {
	if (!this.isReady) {
		return new Promise((resolve) => {
			setTimeout(resolve, 2500);
		}).then(() => {
			return this.getDetails(type);
		});
	}

	const filters = [];
	if (parent) {
		filters.push({
			parent : parent
		});
	}

	return this.models[type].count({
		where : filters
	}).then((res) => {
		return Promise.resolve({
			count : res
		});
	});
};

sqlStore.prototype.convertToReturnValue = function(result, name) {
	return new Promise((resolve, reject) => {
		if (!(result && (result.dataValues || result.entries))) {
			return resolve(null);
		}

		let ret = {};
		Object.keys(result.dataValues).forEach((val) => {
			if (val.indexOf(`${result._modelOptions.name.singular}_`) === 0) {
				ret[val.replace(`${result._modelOptions.name.singular}_`, '')] = JSON.parse(JSON.stringify(result.dataValues[val])).map((r) => {
					return r;
				});
			} else {
				ret[val] = result.dataValues[val];
			}
		});

		if (this.simpleTables[name] && this.simpleTables[name].children && this.simpleTables[name].children.length > 0) {
			//need to fetch all of the children
			return Promise.all(this.simpleTables[name].children.map((c) => {
				return this.getResources(c, 1, 9999, [
					{
						path : "$.parent",
						value : result.id
					}
				]).then((values) => {
					ret[this.columnTableLookups[c]] = values.map((v) => {
						return v.value;
					});
				});
			})).then(() => {
				return resolve(ret);
			});
		}

		return resolve(ret);
	});
};

sqlStore.prototype.getResources = function(type, start, count, filters) {
	if (!this.isReady) {
		return new Promise((resolve) => {
			setTimeout(resolve, 2500);
		}).then(() => {
			return this.getResources(type, start, count, filters);
		});
	}

	if (!start) {
		start = 1;
	}

	if (!count) {
		count = 5;
	}

	const where = {};

	if (filters && filters.forEach) {
		filters.forEach((f) => {
			if (typeof(f.value) === "object" && f.value !== null) {
				//composite values
				if (f.value.fields) {
					let q = [];
					Object.keys(f.value.fields).forEach((k) => {
						let qn = {};
						qn[k.slice(2)] = f.value.fields[k];
						q.push(qn);

					});
					if (f.value.operator === "or") {
						where[this.sequelize.Op.or] = q;
					} else {
						where[this.sequelize.Op.and] = q;
					}
				}
			} else {
				where[f.path.slice(2)] = f.value;
			}
		});
	}

	return this.models[type].findAndCountAll({
		where 	: where,
		limit 	: parseInt(count),
		offset 	: parseInt(start) - 1,
	}).then((results) => {
		return Promise.all(results.rows.map((r) => {
			return this.convertToReturnValue(r, type);
		}));
	}).catch((err) => {
		console.log(err);
		return Promise.reject(err);
	});
};

sqlStore.prototype.getResource = function(type, id) {
	if (!this.isReady) {
		return new Promise((resolve) => {
			setTimeout(resolve, 2500);
		}).then(() => {
			return this.getResource(type, id);
		});
	}

	if (typeof(id) === "undefined" || id === null) {
		return Promise.resolve(null);
	}

	return this.getResources(type, 1, 1, [
		{
			path  : "$.id",
			value : id
		}
	]).then((results) => {
		if (results && results.length === 1) {
			return Promise.resolve(results[0]);
		}

		return Promise.resolve(null);
	});
};

sqlStore.prototype.mapData = function(data, tableName, id) {
	const ret = {};
	let columns = this.tables[tableName];

	Object.keys(columns).forEach((col) => {
		ret[col] = data[col];
	});

	ret[id] = id;

	return ret;
};

sqlStore.prototype.saveResource = function(name, data, id, parentId) {
	if (parentId) {
		data.parent = parentId;
	}

	return new Promise((resolve, reject) => {
		if (!id) {
			if (typeof(data.id) === "undefined" || data.id === null) {
				data.id = this.uuid();
			}

			data.etag = this.uuid();

			return this.models[name].create(this.mapData(data, name)).then(resolve).catch(reject);
		} else {
			//does it exist?
			return this.getResource(name, id).then((item) => {
				if (!item) {
					data.etag = this.uuid();
					data.id = id;
					return this.models[name].create(this.mapData(data, name)).then(resolve).catch(reject);
				}

				data.id = id;
				return this.models[name].update(this.mapData(data, name, id), {
					where : {
						id : id
					}
				}).then(resolve).catch(reject);
			});
		}
	}).then((result) => {
		//ensure any arrays of values are stored correctly
		let promises = [];
		Object.keys(data).forEach((k) => {
			if (Array.isArray(data[k])) {
				if (this.columnTableLookups[`${name}@@${k}`]) {
					//purge the old ones
					promises.push(this.models[this.columnTableLookups[`${name}@@${k}`]].destroy({
						where : {
							parent : data.id
						}
					}));

					//save em!
					promises.push(data[k].map((value) => {
						return this.saveResource(this.columnTableLookups[`${name}@@${k}`], {
							value : value
						}, null, data.id);
					}));
				}
			}
		});

		return Promise.all(promises).then(() => {
			return Promise.resolve(result);
		});
	});
};

sqlStore.prototype.createResource = function(type, id, data) {
	if (!this.isReady) {
		return new Promise((resolve) => {
			setTimeout(resolve, 500);
		}).then(() => {
			return this.createResource(type, id, data);
		});
	}

	//we ignore the ids here, we don't care for the auto-generated ones
	let newResource = null;
	data.id = id;

	return this.saveResource(type, data, null).then((_newResource) => {
		newResource = _newResource;
		return Promise.resolve(newResource.dataValues);
	}).catch((err) => {
		if (err && (err.original && err.original.code === "ER_DUP_ENTRY" || (err.fields && err.fields.indexOf('id') === 0))) {
			return Promise.reject(new Error("Resource already exists"));
		}

		return Promise.reject(err);
	});
};

sqlStore.prototype.updateResource = function(type, id, data, parentId) {
	if (!this.isReady) {
		return new Promise((resolve) => {
			setTimeout(resolve, 2500);
		}).then(() => {
			return this.updateResource(type, id, data, parentId);
		});
	}

	let updatedResource = data;
	return this.saveResource(type, data, id, parentId).then((_newResource) => {
		return Promise.resolve(updatedResource);
	});
};

sqlStore.prototype.deleteResource = function(type, id) {
	if (!this.isReady) {
		return new Promise((resolve) => {
			setTimeout(resolve, 2500);
		}).then(() => {
			return this.deleteResource(type, id);
		});
	}

	return this.models[type].destroy({
		where : {
			id : id
		}
	});
};

module.exports = function(connectionString, typeConfig, sequelize, uuid) {
	if (!connectionString) {
		connectionString = process.env.POSTGRES_CONNECTION_STRING;
	}

	if (!sequelize) {
		sequelize = require("sequelize");
	}

	if (!uuid) {
		uuid = require("uuid/v4");
	}

	return new sqlStore(connectionString, typeConfig, sequelize, uuid);
};