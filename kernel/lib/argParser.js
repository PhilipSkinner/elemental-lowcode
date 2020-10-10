const argParser = function() {};

argParser.prototype._parseArg = function(raw) {
	let parts = raw.split("=");

	//just defined
	if (parts.length === 1) {
		parts.push(true);
	}

	//had an equals inside the value
	if (parts.length > 2) {
		parts[1] = parts.slice(1).join("=");
		parts = parts.slice(0, 2);
	}

	const keys = parts[0].split(".").reverse();
	let ret = {};
	let set = false;

	//construct our object
	keys.forEach((name) => {
		if (set) {
			let newRet = {};
			newRet[name] = ret;
			ret = newRet;
		} else {
			ret[name] = parts[1];
		}
		set = true;
	});

	return ret;
};

argParser.prototype._merge = function(parent, child) {
	Object.keys(child).forEach((name) => {
		//merge if they are objects
		if (child.hasOwnProperty(name)) {
			if (parent[name] && typeof(parent[name]) === "object" && typeof(child[name]) === "object") {
				this._merge(parent[name], child[name]);
			} else if (!parent.hasOwnProperty(name) && !parent[name]) {
				//only assign if the parent doesn"t have this property defined yet
				parent[name] = child[name];
			} else if (parent[name] && typeof(parent[name]) !== "object" && typeof(child[name]) !== "object") {
				parent[name] = [
					parent[name],
					child[name]
				];
			}
		}
	});
};

argParser.prototype.fetch = function() {
	const ret = {};

	process.argv.forEach((arg) => {
		if (arg.indexOf("--") === 0) {
			//its an arg, lets parse and merge
			this._merge(ret, this._parseArg(arg.substr(2)));
		}
	});

	return ret;
};

module.exports = function() {
	return new argParser();
};