const render = function(fs, path, preProcessor) {
	this.fs = fs;
	this.path = path;
	this.preProcessor = preProcessor;
	this.tabLevel = -1;

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
	if (val.trim().indexOf('<!-- @clickHandler -->') === 0) {
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
		console.log(customTag);

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
		var text = c.text;

		if (Array.isArray(text)) {
			text = text.join(' ');
		}

		var content = ((typeof(text) === 'undefined' || text === null ? '' : '\n' + this.generateTabs() + '\t' + text + '\n') + this.renderChildren(c.children, data));

		return {
			start 	: this.renderTagWithProperties(c.tag, c, data) + '>',
			content : content,
			end 	: this.generateTabs() + `</${c.tag}>`
		};
	} else {
		return {
			start : this.renderTagWithProperties(c.tag, c, data),
			content : '',
			end : ' />',
		};
	}
};

render.prototype.generateTabs = function() {
	var ret = '';
	for (var i = 0; i < this.tabLevel; i++) {
		ret += '\t';
	}
	return ret;
};

render.prototype.renderChildren = function(children, data) {
	if (!children) {
		return '';
	}

	this.tabLevel++;

	var ret = children.map((c) => {
		return this.handleTag(c, data);
	}).reduce((s, a) => {
		if (a) {
			if (Array.isArray(a)) {
				a.forEach((aa) => {
					s += this.endClickHandler(this.generateTabs() + aa.start + aa.content + aa.end) + '\n';
				});
			} else {
				s += this.endClickHandler(this.generateTabs() + a.start + a.content + a.end);
			}
		}

		return s + '\n';
	}, '\n');

	this.tabLevel--;

	return ret;
};

render.prototype.renderView = function(view, bag) {
	this.tabLevel = -1;

	return this.preProcessor.process(view, {
		bag : bag
	}, this.customTags).then((processed) => {
		return Promise.resolve('<!DOCTYPE HTML>' + this.renderChildren(processed.view, processed.data));
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