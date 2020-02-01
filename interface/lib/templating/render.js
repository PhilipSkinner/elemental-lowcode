const render = function(fs, path, preProcessor) {
	this.fs = fs;
	this.path = path;
	this.preProcessor = preProcessor;

	this.invalidProperties = [
		'text',
		'tag',
		'onclick',
		'children',
		'repeat',
		'submit',
		'bind',
		'_scope'
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
	if (Array.isArray(c)) {
		return c.map((cc) => {
			return this.handleTag(cc, data);
		});
	};

	if (c.children || c.text) {
		return {
			start 	: this.renderTagWithProperties(c.tag, c, data) + '>',
			content : (typeof(c.text) === 'undefined' || c.text === null ? '' : c.text) + this.renderChildren(c.children, data),
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

render.prototype.renderChildren = function(children, data) {
	if (!children) {
		return '';
	}

	return children.map((c) => {
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
	return this.preProcessor.process(view, {
		bag : bag
	}, this.customTags).then((processed) => {
		return Promise.resolve(this.renderChildren(processed.view, processed.data));
	});
};

module.exports = function(fs, path, preProcessor) {
	if (!fs) {
		fs = require('fs');
	}

	if (!path) {
		path = require('path');
	}

	if (!preProcessor) {
		preProcessor = require('./preProcessor')();
	}

	return new render(fs, path, preProcessor);
};