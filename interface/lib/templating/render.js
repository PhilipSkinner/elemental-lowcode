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
		"script",
		"div",
		"a"
	];
	this.singleProps = [
		"required",
		"checked"
	];
	this.internalClick = [
		"td",
		"th"
	];
	this.nativeClickTags = [
		"a",
		"area"
	];
	this.customTags = {};
};

render.prototype._getPollParams = function(eventProps) {
	let pollParams = "";
	if (eventProps.poll) {
		if (eventProps.poll.every) {
			pollParams = ` data-poll="${eventProps.poll.every}" `;
		}
	}
	return pollParams;
}

render.prototype.submitHandler = function(eventProps, toWrap) {
	let action = "";
	if (eventProps && eventProps.eventName) {
		action = `?_event=${eventProps.eventName}`;
	}

	let pollParams = this._getPollParams(eventProps);

	return `${toWrap} method="POST" action="${action}" ${pollParams} `;
};

render.prototype._unpackParams = function(prefix, params) {
	if (Array.isArray(params)) {
		return params.map((val, index) => {
			if (typeof(val) === "object") {
				return this._unpackParams(`${prefix}${index}__`, val);
			}
			return `${encodeURIComponent(prefix)}${encodeURIComponent(index)}=${encodeURIComponent(params[index])}`;
		}).join("&").replace(/&&/g, "&");
	}

	return Object.keys(params || {}).map((key) => {
		if (typeof(params[key]) === "object") {
			return this._unpackParams(`${prefix}${key}__`, params[key]);
		};
		return `${encodeURIComponent(prefix)}${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
	}).join("&").replace(/&&/g, "&");
};

render.prototype.clickHandler = function(eventProps, toWrap, parentTag) {
	if (
		typeof(eventProps) === "undefined"
		|| eventProps === null
		|| typeof(eventProps.eventName) === 'undefined'
		|| eventProps.eventName === null
		|| eventProps.eventName === ""
	) {
		return toWrap;
	}

	let extraParams = this._unpackParams("", eventProps.params || {});
	let pollParams = this._getPollParams(eventProps);

	if (this.nativeClickTags.indexOf(parentTag) !== -1) {
		//just add the params on
		return `${toWrap} href="?event=${eventProps.eventName}&${extraParams}" ${pollParams} `;
	}

	if (this.internalClick.indexOf(parentTag) !== -1) {
		return `<!-- @internalClickHandler -->${toWrap}><a href="?event=${eventProps.eventName}&${extraParams}" ${pollParams}>`;
	}

	return `<!-- @clickHandler --><a href="?event=${eventProps.eventName}&${extraParams}" ${pollParams}>${toWrap}`;
};

render.prototype.endClickHandler = function(val) {
	if (val.trim().indexOf("<!-- @clickHandler -->") === 0) {
		return `${val}</a><!-- /@clickHandler -->`;
	}

	if (val.trim().indexOf("<!-- @internalClickHandler -->") === 0) {
		let lastTagPos = val.lastIndexOf('<');
		val = val.substring(0, lastTagPos) + "</a>" + val.substring(lastTagPos);
		return `${val}<!-- /@internalClickHandler -->`;
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
			render = this.clickHandler(propValue, render, tag);
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
		return {
			start 		: "",
			content 	: "",
			end 		: ""
		};
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
			start 	: (this.renderTagWithProperties(c.tag, c, data) + ">").replace(">>", ">"),
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
	if (!children || !Array.isArray(children)) {
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