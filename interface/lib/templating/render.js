const render = function() {
	this.invalidProperties = [
		'text',
		'tag',
		'onclick',
		'children'
	];
};

render.prototype.renderTagWithProperties = function(tag, properties) {
	let render = `<${tag}`;

	Object.keys(properties).forEach((p) => {
		if (this.invalidProperties.indexOf(p) === -1 && properties[p] !== null) {
			let propValue = properties[p];
			if (Array.isArray(properties[p])) {
				propValue = properties[p].join(' ');
			}

			render += ` ${p}="${propValue}" `;
		}
	});

	return render;
};

render.prototype.renderChildren = function(children) {
	if (!children) {
		return '';
	}	

	return children.map((c) => {
		if (c.children || c.text) {
			return {
				start 	: this.renderTagWithProperties(c.tag, c) + '>',
				content : (typeof(c.text) === 'undefined' || c.text === null ? '' : c.text) + this.renderChildren(c.children),
				end 	: `</${c.tag}>`
			};
		} else {
			return {
				start : this.renderTagWithProperties(c.tag, c),
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
		return resolve('<!DOCTYPE html>' + this.renderChildren([view]));
	});
	
};

module.exports = function() {
	return new render();
};