const render = function(fs, path) {
	this.fs = fs;
	this.path = path;

	this.invalidProperties = [
		'text',
		'tag',
		'onclick',
		'children',
		'repeat'
	];
	this.customTags = {};
};

render.prototype.resolveValue = function(path, bag) {
	let current = bag;
	let parts = path.split('.');
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

render.prototype.handleVariables = function(string, bag) {
	if (!string || string.indexOf('$') === -1) {
		return string;
	}

	const regex = /\$([\w\.]+)/gm;
	let m;

	let replacements = [];

	while ((m = regex.exec(string)) !== null) {
	    // This is necessary to avoid infinite loops with zero-width matches
	    if (m.index === regex.lastIndex) {
	        regex.lastIndex++;
	    }

	    // The result can be accessed through the `m`-variable.
	    m.forEach((match, groupIndex) => {
	    	var rep = this.resolveValue(match, bag);

	    	if (rep) {
	        	replacements.push({
	        		val : match,
	        		rep : this.resolveValue(match, bag)
	        	});
	    	}
	    });
	}

	replacements.forEach((r) => {
		string = string.replace('$' + r.val, r.rep);
	});

	return string;
};

render.prototype.loadView = function(name) {
	return new Promise((resolve, reject) => {
		this.fs.readFile(this.path.join(process.env.DIR, name), (err, content) => {
			if (err) {
				return reject(err);
			}

			let data = null;
			try {
				data = JSON.parse(content);
			} catch(e) {}

			if (data == null) {
				return reject(new Error(`Cannot load view ${name}`));
			}

			return resolve(data);
		});
	});
};

render.prototype.registerCustomTag = function(customTag) {
	this.loadView(customTag.view).then((definition) => {
		customTag.definition = definition;
		this.customTags[customTag.name] = customTag;
	});
};

render.prototype.renderTagWithProperties = function(tag, properties, injectedProps, bag) {
	let render = `<${tag}`;

	Object.keys(properties).forEach((p) => {
		if (this.invalidProperties.indexOf(p) === -1 && properties[p] !== null) {
			let propValue = properties[p];

			if (injectedProps) {
				if (propValue.indexOf('$.') === 0 && injectedProps[propValue.replace('$.', '')]) {
					propValue = injectedProps[propValue.replace('$.', '')];
				}
			}

			if (Array.isArray(properties[p])) {
				propValue = properties[p].join(' ');
			}

			propValue = this.handleVariables(propValue, bag);

			render += ` ${p}="${propValue}" `;
		}
	});

	return render;
};

render.prototype.handleTag = function(c, injectedProps, bag) {
	//is it a custom tag?
	if (this.customTags[c.tag]) {
		return {
			start 	: `<${c.tag}>`,
			content : this.renderChildren([this.customTags[c.tag].definition], c, bag),
			end 	: `</${c.tag}>`,
		};
	}

	if (c.children || c.text) {
		var text = c.text;

		if (injectedProps && text) {
			if (text.indexOf('$.') === 0 && injectedProps[text.replace('$.', '')]) {
				text = injectedProps[text.replace('$.', '')];
			}
		}

		var children = c.children;
		if (typeof(children) === "string" && injectedProps) {
			if (children.indexOf('$.') === 0 && injectedProps[children.replace('$.', '')]) {
				children = injectedProps[children.replace('$.', '')];
			}
		}

		if (text !== 'undefined') {
			text = this.handleVariables(text, bag);
		}

		return {
			start 	: this.renderTagWithProperties(c.tag, c, injectedProps, bag) + '>',
			content : (typeof(text) === 'undefined' || text === null ? '' : text) + this.renderChildren(children, injectedProps, bag),
			end 	: `</${c.tag}>`
		};
	} else {
		return {
			start : this.renderTagWithProperties(c.tag, c, injectedProps, bag),
			content : '',
			end : ' />',
		};
	}
};

render.prototype.renderChildren = function(children, injectedProps, bag) {
	if (!children) {
		return '';
	}

	return children.map((c) => {
		if (c.repeat) {
			//its a repeating group, repeat as many times as values in the bag
			var parts = c.repeat.split(' ');
			var arr = this.resolveValue(parts[2].replace('$', ''), bag);

			const calculated = arr.map((a) => {
				var newBag = {};
				newBag[parts[0].replace('$', '')] = a;
				return this.handleTag(c, injectedProps, newBag);
			});


			return calculated;
		}

		return this.handleTag(c, injectedProps, bag);
	}).reduce((s, a) => {
		if (a) {
			if (Array.isArray(a)) {
				a.forEach((aa) => {
					s += aa.start + aa.content + aa.end;
				});
			} else {
				s += a.start + a.content + a.end;
			}
		}

		return s;
	}, '');
};

render.prototype.renderView = function(view, bag) {
	return new Promise((resolve, reject) => {
		return resolve(this.renderChildren([view], null, bag));
	});

};

module.exports = function(fs, path) {
	if (!fs) {
		fs = require('fs');
	}

	if (!path) {
		path = require('path');
	}

	return new render(fs, path);
};