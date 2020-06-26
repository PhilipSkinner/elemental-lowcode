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
		pool: {
			max			: 5,
			min			: 0,
			acquire		: 30000,
			idle		: 10000
		},
		define : {
			freezeTableName	: true,
			charset 		: this.connectionString.indexOf("postgres://") !== -1 ? "utf-8" : "utf8",
			dialectOptions 	: dialectOptions,
			timestamps 		: false
		},
		logging: false
	});

	this.simpleTypes = [
		"string",
		"boolean",
		"integer",
		"number",
		"datetime"
	];

	this.models = {};
	this.tables = {};
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

	if (type === "number") {
		return this.sequelize.DECIMAL;
	}

	if (type === "datetime") {
		return this.sequelize.DATE;
	}

	return this.sequelize.TEXT;
};

sqlStore.prototype.determineTables = function(baseName, schemaConfig, tables, parentName) {
	let columns = {};

	if (schemaConfig.type === "object") {
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
				tables = this.determineTables(`${baseName}_${propName}`, schemaConfig.properties[propName], tables, baseName);
			}
		});

		tables[baseName] = columns;
	}

	if (schemaConfig.type === "array") {
		tables = this.determineTables(`${baseName}`, schemaConfig.items, tables, parentName);
	}

	return tables;
};

sqlStore.prototype.initType = function() {
	return new Promise((resolve, reject) => {
		//generate our list of tables and columns
		this.tables = this.determineTables(this.config.name, this.config.schema, {});

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
				return doNext();
			});
		}

		return doNext().then(resolve).catch(reject);
	});
};

sqlStore.prototype.getDetails = function(type) {
	if (!this.isReady) {
		return new Promise((resolve) => {
			setTimeout(resolve, 2500);
		}).then(() => {
			return this.getDetails(type);
		});
	}

	return this.mainTable.count().then((res) => {
		return Promise.resolve({
			count : res
		});
	});
};

sqlStore.prototype.generateIncludes = function() {
	const include = {};
	let hasIncludes = false;
	let currentInclude = include;
	let last = null;

	Object.keys(this.models).sort().forEach((name) => {
		if (name !== this.mainTable.name) {
			hasIncludes = true;
			currentInclude.model = this.models[name];
			currentInclude.required = false;
			currentInclude.include = [{}];

			last = currentInclude;
			currentInclude = currentInclude.include[0];
		}
	});

	if (last && last.include) {
		delete(last.include);
	}

	if (hasIncludes) {
		return [include];
	}

	return [];
};

sqlStore.prototype.convertToReturnValue = function(result) {
	if (!(result && (result.dataValues || result.entries))) {
		return null;
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

	return ret;
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
			where[f.path.slice(2)] = f.value;
		});
	}

	return this.mainTable.findAll({
		include : this.generateIncludes(),
		where 	: where,
		offset 	: start - 1,
		limit 	: count + 1 - 1,
	}).then((results) => {
		return Promise.resolve(results.map((r) => {
			return this.convertToReturnValue(r);
		}));
	}).catch((err) => {
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

	if (!id) {
		if (typeof(data.id) === "undefined" || data.id === null) {
			data.id = this.uuid();
		}

		data.etag = this.uuid();

		return this.models[name].create(this.mapData(data, name));
	} else {
		return this.models[name].update(this.mapData(data, name, id), {
			where : {
				id : id
			}
		});
	}
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

		//scan each key
		return Promise.all(Object.keys(data).map((key) => {
			let obj = JSON.parse(JSON.stringify(data[key]));

			if (Array.isArray(obj)) {
				return this.updateChildren(`${type}_${key}`, obj, newResource.dataValues.id);
			} else if (typeof(obj) === 'object' && obj !== null) {
				return this.updateResource(`${type}_${key}`, null, obj, newResource.dataValues.id);
			}
		}));
	}).then(() => {
		return Promise.resolve(newResource.dataValues);
	}).catch((err) => {
		if (err && (err.original && err.original.code === "ER_DUP_ENTRY" || (err.fields && err.fields.indexOf('id') === 0))) {
			return Promise.reject(new Error("Resource already exists"));
		}

		return Promise.reject(err);
	});
};

sqlStore.prototype.updateChildren = function(type, data, parentId) {
	const doNext = () => {
		if (data.length === 0) {
			return Promise.resolve();
		}

		const next = data.pop();

		console.log(next);

		return this.saveResource(`${type}`, next, next.id, parentId).then(doNext);
	};

	//remove all children that are no longer included within the object
	return this.models[type].destroy({
		where : {
			id : {
				[this.sequelize.Op.notIn] : data.map((d) => {
					return d.id;
				})
			},
			parent : parentId
		}
	}).then(() => {
		return doNext();
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
	return this.saveResource(type, data, id, parentId).then(() => {
		//scan each key
		return Promise.all(Object.keys(data).map((key) => {
			let obj = JSON.parse(JSON.stringify(data[key]));

			if (Array.isArray(obj)) {
				return this.updateChildren(`${type}_${key}`, obj, id);
			} else if (typeof(obj) === 'object' && obj !== null) {
				return this.updateResource(`${type}_${key}`, obj.id, obj, id);
			}

			return Promise.resolve();
		}));
	}).then(() => {
		return updatedResource;
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

	return this.mainTable.destroy({
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