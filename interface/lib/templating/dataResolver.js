const dataResolver = function() {

};

dataResolver.prototype.detectValues = function(string, data, scope) {
	if (!string || !string.indexOf || string.indexOf('$.') === -1) {
		return string;
	}

	const regex = /(\$\.[\w\.]+)/gm;
	let m;
	//scoped data takes precedence
	let scopedData = Object.assign(scope, data);

	let replacements = [];

	while ((m = regex.exec(string)) !== null) {
	    // This is necessary to avoid infinite loops with zero-width matches
	    if (m.index === regex.lastIndex) {
	        regex.lastIndex++;
	    }

	    // The result can be accessed through the `m`-variable.
	    m.forEach((match, groupIndex) => {
	    	var rep = this.resolveValue(match, scopedData);

	    	if (rep) {
	        	replacements.push({
	        		val : match,
	        		rep : this.resolveValue(match, scopedData)
	        	});
	    	}
	    });
	}

	replacements.forEach((r) => {
		if (typeof(r.rep) === 'object') {
			string = r.rep;
		} else {
			string = string.replace(r.val, r.rep);
		}
	});

	return string;
};

dataResolver.prototype.resolveValue = function(path, data) {
	let current = data;
	let parts = path.replace('$.', '').split('.');
	parts.forEach((p) => {
		if (current) {
			current = current[p];
		}
	});

	if (!current) {
		return path;
	}

	return current;
};

module.exports = function() {
	return new dataResolver();
};