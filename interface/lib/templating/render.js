const render = function(fs, path, preProcessor) {
	this.fs = fs;
	this.path = path;
	this.preProcessor = preProcessor;
	this.tabLevel = -1;

	this.invalidProperties = [
		"text",
		"tag",
		"onclick",
		"children",
		"repeat",
		"submit",
		"bind",
		"_scope",
		"if"
	];
	this.requireClosing = [
		"script"
	];
	this.singleProps = [
		"required",
		"checked"
	];
	this.customTags = {};
};

render.prototype.submitHandler = function(eventProps, toWrap) {
	let action = "";

	if (eventProps && eventProps.eventName) {
		action = `?_event=${eventProps.eventName}`;
	}

	return `${toWrap} method="POST" action="${action}" `;
};

render.prototype.clickHandler = function(eventProps, toWrap) {
	let extraParams = Object.keys(eventProps.params || {}).map((key) => {
		if (typeof(eventProps.params[key]) === "object") {
			return "";
		};
		return `${encodeURIComponent(key)}=${encodeURIComponent(eventProps.params[key])}`;
	}).join("&").replace(/&&/g, "&");

	return `<!-- @clickHandler --><a href="?event=${eventProps.eventName}&${extraParams}">${toWrap}`;
};

render.prototype.endClickHandler = function(val) {
	if (val.trim().indexOf("<!-- @clickHandler -->") === 0) {
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
			} catch(e) {
				console.error(`Could not parse view ${name} - ${e}`);
			}

			if (data === null) {
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
				propValue = properties[p].join(" ");
			}

			if (this.singleProps.indexOf(p) === -1) {
				render += ` ${p}="${propValue}" `;
			} else {
				if (propValue != "false") {
					render += ` ${p} `;
				}
			}
		}

		if (p === "onclick") {
			render = this.clickHandler(propValue, render);
		}

		if (p === "submit") {
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

	if (typeof(c.__display) !== "undefined" && c.__display === false) {
		return "";
	}

	if (c.children || (typeof(c.text) !== "undefined" && c.text !== null)) {
		var text = c.text;

		if (Array.isArray(text)) {
			text = text.join(" ");
		}

		var content = (
			(
				typeof(text) === "undefined" || text === null
					? ""
					: (
						c.tag === "textarea" ? "" : "\n" + this.generateTabs() + "\t"
					) + text + (c.tag === "textarea" ? "" : "\n")
			)
			+ this.renderChildren(c.children, data)
		);

		return {
			start 	: this.renderTagWithProperties(c.tag, c, data) + ">",
			content : content,
			end 	: (c.tag === "textarea" ? "" : this.generateTabs()) + `</${c.tag}>`
		};
	} else {
		return {
			start : this.renderTagWithProperties(c.tag, c, data),
			content : "",
			end : this.requireClosing.indexOf(c.tag) === -1 ? " />" : `></${c.tag}>`,
		};
	}
};

render.prototype.generateTabs = function() {
	var ret = "";
	for (var i = 0; i < this.tabLevel; i++) {
		ret += "\t";
	}
	return ret;
};

render.prototype.renderChildren = function(children, data) {
	if (!children) {
		return "";
	}

	this.tabLevel++;

	var ret = children.map((c) => {
		return this.handleTag(c, data);
	}).reduce((s, a) => {
		if (a) {
			if (Array.isArray(a)) {
				a.forEach((aa) => {
					s += this.endClickHandler(this.generateTabs() + aa.start + aa.content + aa.end) + "\n";
				});
			} else {
				s += this.endClickHandler(this.generateTabs() + a.start + a.content + a.end);
			}
		}

		return s + "\n";
	}, "\n");

	this.tabLevel--;

	return ret;
};

render.prototype.renderView = function(view, bag) {
	this.tabLevel = -1;

	return this.preProcessor.process(view, {
		bag : bag
	}, this.customTags).then((processed) => {
		return Promise.resolve("<!DOCTYPE HTML>" + this.renderChildren(processed.view, processed.data));
	});
};

module.exports = function(fs, path, preProcessor) {
	if (!fs) {
		fs = require("fs");
	}

	if (!path) {
		path = require("path");
	}

	if (!preProcessor) {
		preProcessor = require("./preProcessor")();
	}

	return new render(fs, path, preProcessor);
};