const render = function(fs, path) {
	this.fs = fs;
	this.path = path;

	this.invalidProperties = [
		'text',
		'tag',
		'onclick',
		'children'
	];
	this.customTags = {};
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

render.prototype.renderTagWithProperties = function(tag, properties, injectedProps) {
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

			render += ` ${p}="${propValue}" `;
		}
	});

	return render;
};

render.prototype.renderChildren = function(children, injectedProps) {
	if (!children) {
		return '';
	}

	return children.map((c) => {
		//is it a custom tag?
		if (this.customTags[c.tag]) {
			return {
				start 	: `<${c.tag}>`,
				content : this.renderChildren([this.customTags[c.tag].definition], c),
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

			return {
				start 	: this.renderTagWithProperties(c.tag, c, injectedProps) + '>',
				content : (typeof(text) === 'undefined' || text === null ? '' : text) + this.renderChildren(children, injectedProps),
				end 	: `</${c.tag}>`
			};
		} else {
			return {
				start : this.renderTagWithProperties(c.tag, c, injectedProps),
				content : '',
				end : ' />',
			};
		}
	}).reduce((s, a) => {
		s += a.start + a.content + a.end;
		return s;
	}, '');
};

render.prototype.renderView = function(view) {
	return new Promise((resolve, reject) => {
		return resolve(this.renderChildren([view]));
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