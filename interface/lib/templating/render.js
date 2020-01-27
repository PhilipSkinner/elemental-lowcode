const render = function(fs, path) {
	this.fs = fs;
	this.path = path;

	this.invalidProperties = [
		'text',
		'tag',
		'onclick',
		'children',
		'repeat',
		'submit',
		'bind'
	];
	this.customTags = {};
};

render.prototype.submitHandler = function(eventProps, toWrap) {
	return `${toWrap} method="POST" action="" `;
};

render.prototype.clickHandler = function(eventProps, toWrap) {
	return `<!-- @clickHandler --><a href="?event=${eventProps.eventName}">${toWrap}`;
};

render.prototype.endClickHandler = function(val) {
	if (val.indexOf('<!-- @clickHandler -->') === 0) {
		return `${val}</a><!-- /@clickHandler -->`;
	}

	return val;
}

render.prototype.flattenBag = function(bag) {
	if (bag.bag) {
		return bag.bag;
	}

	return bag;
};

render.prototype.generateData = function(objects) {
	var ret = {};
	objects.forEach((o) => {
		ret = Object.assign(ret, o);
	});
	return ret;
};

render.prototype.resolveValue = function(path, data) {
	let current = data;
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

render.prototype.handleVariables = function(string, data) {
	if (!string || string.indexOf('$.') === -1) {
		return string;
	}

	const regex = /\$\.([\w\.]+)/gm;
	let m;

	let replacements = [];

	while ((m = regex.exec(string)) !== null) {
	    // This is necessary to avoid infinite loops with zero-width matches
	    if (m.index === regex.lastIndex) {
	        regex.lastIndex++;
	    }

	    // The result can be accessed through the `m`-variable.
	    m.forEach((match, groupIndex) => {
	    	var rep = this.resolveValue(match, data);

	    	if (rep) {
	        	replacements.push({
	        		val : match,
	        		rep : this.resolveValue(match, data)
	        	});
	    	}
	    });
	}

	replacements.forEach((r) => {
		if (typeof(r.rep) === 'object') {
			string = r.rep;
		} else {
			string = string.replace('$.' + r.val, r.rep);
		}
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

render.prototype.renderTagWithProperties = function(tag, properties, data) {
	let render = `<${tag}`;

	Object.keys(properties).forEach((p) => {
		let propValue = properties[p];

		if (this.invalidProperties.indexOf(p) === -1 && properties[p] !== null) {
			if (Array.isArray(properties[p])) {
				propValue = properties[p].join(' ');
			}

			propValue = this.handleVariables(propValue, data);

			render += ` ${p}="${propValue}" `;
		}

		if (p === 'onclick') {
			render = this.clickHandler(propValue, render);
		}

		if (p === 'submit') {
			render = this.submitHandler(propValue, render);
		}
	});

	return render;
};

render.prototype.handleTag = function(c, data) {
	//is it a custom tag?
	if (this.customTags[c.tag]) {
		return {
			start 	: `<${c.tag}>`,
			content : this.renderChildren([this.customTags[c.tag].definition], c, data),
			end 	: `</${c.tag}>`,
		};
	}

	if (c.children || c.text) {
		var text = c.text;

		if (data && text) {
			text = this.handleVariables(text, data);
		}

		var children = c.children;
		if (typeof(children) === "string") {
			children = this.handleVariables(children, data);
		}

		return {
			start 	: this.renderTagWithProperties(c.tag, c, data) + '>',
			content : (typeof(text) === 'undefined' || text === null ? '' : text) + this.renderChildren(children, {}, data),
			end 	: `</${c.tag}>`
		};
	} else {
		return {
			start : this.renderTagWithProperties(c.tag, c, data),
			content : '',
			end : ' />',
		};
	}
};

render.prototype.renderChildren = function(children, injectedProps, bag) {
	if (!children) {
		return '';
	}

	let data = this.generateData([injectedProps, bag]);

	return children.map((c) => {
		if (c.repeat) {
			//its a repeating group, repeat as many times as values in the bag
			var parts = c.repeat.split(' ');
			var arr = this.resolveValue(parts[2].replace('$.', ''), data);

			const calculated = arr.map((a) => {
				var newBag = {};
				newBag[parts[0].replace('$.', '')] = a;
				let data = this.generateData([injectedProps, bag, newBag]);
				return this.handleTag(c, data);
			});

			return calculated;
		}

		return this.handleTag(c, data);
	}).reduce((s, a) => {
		if (a) {
			if (Array.isArray(a)) {
				a.forEach((aa) => {
					s += this.endClickHandler(aa.start + aa.content + aa.end);
				});
			} else {
				s += this.endClickHandler(a.start + a.content + a.end);
			}
		}

		return s;
	}, '');
};

render.prototype.renderView = function(view, bag) {
	return new Promise((resolve, reject) => {
		return resolve(this.renderChildren([view], {}, { bag : bag }));
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