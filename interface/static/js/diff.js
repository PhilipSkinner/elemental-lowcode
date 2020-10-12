// Many thanks to Chris Ferdinandi who provided a tutorial on this.
//
// The code below was taken from that tutorial and modified to fix a couple of
// bugs that became apparent during inclusion in Elemental.
//
// The following is the MIT license exerpt from https://gomakethings.com/mit/
//
// MIT License
//
// Copyright © Chris Ferdinandi
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var support = (function () {
	if (!window.DOMParser) return false;
	var parser = new DOMParser();
	try {
		parser.parseFromString('x', 'text/html');
	} catch(err) {
		return false;
	}
	return true;
})();

/**
 * Convert a template string into HTML DOM nodes
 * @param  {String} str The template string
 * @return {Node}       The template HTML
 */
var stringToHTML = function (str) {

	// If DOMParser is supported, use it
	if (support) {
		var parser = new DOMParser();
		var doc = parser.parseFromString(str, 'text/html');
		return doc;
	}

	// Otherwise, fallback to old-school method
	var dom = document.createElement('html');
	dom.innerHTML = str;

	return dom;

};

/**
 * Create an array of the attributes on an element
 * @param  {NamedNodeMap} attributes The attributes on an element
 * @return {Array}                   The attributes on an element as an array of key/value pairs
 */
var getAttributes = function (attributes) {
	return Array.prototype.map.call(attributes, function (attribute) {
		return {
			att: attribute.name,
			value: attribute.value
		};
	});
};

/**
 * Create a DOM Tree Map for an element
 * @param  {Node}    element The element to map
 * @param  {Boolean} isSVG   If true, node is within an SVG
 * @return {Array}           A DOM tree map
 */
var createDOMMap = function (element, isSVG) {
	return Array.prototype.map.call(element.childNodes, (function (node) {
		var details = {
			content: node.childNodes && node.childNodes.length > 0 ? null : node.textContent,
			atts: node.nodeType !== 1 ? [] : getAttributes(node.attributes),
			type: node.nodeType === 3 ? 'text' : (node.nodeType === 8 ? 'comment' : (node.nodeType === 10 ? "html" : node.tagName.toLowerCase())),
			node: node
		};
		details.isSVG = isSVG || details.type === 'svg';
		details.children = createDOMMap(node, details.isSVG);
		return details;
	}));
};

var getStyleMap = function (styles) {
	return styles.split(';').reduce(function (arr, style) {
		if (style.trim().indexOf(':') > 0) {
			var styleArr = style.split(':');
			arr.push({
				name: styleArr[0] ? styleArr[0].trim() : '',
				value: styleArr[1] ? styleArr[1].trim() : ''
			});
		}
		return arr;
	}, []);
};

var removeStyles = function (elem, styles) {
	styles.forEach(function (style) {
		elem.style[style] = '';
	});
};

var changeStyles = function (elem, styles) {
	styles.forEach(function (style) {
		elem.style[style.name] = style.value;
	});
};

var diffStyles = function (elem, styles) {

	// Get style map
	var styleMap = getStyleMap(styles);

	// Get styles to remove
	var remove = Array.prototype.filter.call(elem.style, function (style) {
		var findStyle = styleMap.find(function (newStyle) {
			return newStyle.name === style && newStyle.value === elem.style[style];
		});
		return findStyle === undefined;
	});

	// Add and remove styles
	removeStyles(elem, remove);
	changeStyles(elem, styleMap);

};

var removeAttributes = function (elem, atts) {
	atts.forEach(function (attribute) {
		// If the attribute is a class, use className
		// Else if it's style, remove all styles
		// Otherwise, use removeAttribute()
		if (attribute.att === 'class') {
			elem.className = '';
		} else if (attribute.att === 'style') {
			removeStyles(elem, Array.prototype.slice.call(elem.style));
		} else {
			elem.removeAttribute(attribute.att);
		}
	});
};

/**
 * Add attributes to an element
 * @param {Node}  elem The element
 * @param {Array} atts The attributes to add
 */
var addAttributes = function (elem, atts) {
	atts.forEach(function (attribute) {
		// If the attribute is a class, use className
		// Else if it's style, diff and update styles
		// Otherwise, set the attribute
		if (attribute.att === 'class') {
			elem.className = attribute.value;
		} else if (attribute.att === 'style') {
			diffStyles(elem, attribute.value);
		} else {
			elem.setAttribute(attribute.att, attribute.value);
		}
	});
};

/**
 * Diff the attributes on an existing element versus the template
 * @param  {Object} template The new template
 * @param  {Object} existing The existing DOM node
 */
var diffAtts = function (template, existing, automatic) {
	if (!automatic) {
		//reset any user modifiable attributes
		var modifiable = ["value"];
		var ignoreType = ["radio", "checkbox", "submit", "button"];
		modifiable.forEach((m) => {
			if (ignoreType.indexOf(existing.node.type) === -1) {
				existing.node[m] = "";
			}
		});
	}

  	// Get attributes to remove
	var remove = existing.atts.filter(function (att) {
		var getAtt = template.atts.find(function (newAtt) {
			return att.att === newAtt.att;
		});
		return getAtt === undefined;
	});

	// Get attributes to change
	var change = template.atts.filter(function (att) {
		var getAtt = existing.atts.find(function (existingAtt) {
			return att.att === existingAtt.att;
		});
		return getAtt === undefined || getAtt.value !== att.value;
	});

	// Add/remove any required attributes
	addAttributes(existing.node, change);
	removeAttributes(existing.node, remove);
};

/**
 * Make an HTML element
 * @param  {Object} elem The element details
 * @return {Node}        The HTML element
 */
var makeElem = function (elem) {

	// Create the element
	var node;
	if (elem.type === 'text') {
		node = document.createTextNode(elem.content);
	} else if (elem.type === 'comment') {
		node = document.createComment(elem.content);
	} else if (elem.isSVG) {
		node = document.createElementNS('http://www.w3.org/2000/svg', elem.type);
	} else {
		node = document.createElement(elem.type);
	}

	// Add attributes
	addAttributes(node, elem.atts);

	// If the element has child nodes, create them
	// Otherwise, add textContent
	if (elem.children.length > 0) {
		elem.children.forEach(function (childElem) {
			node.appendChild(makeElem(childElem));
		});
	} else if (elem.type !== 'text') {
		node.textContent = elem.content;
	}

	return node;

};

/**
 * Diff the existing DOM node versus the template
 * @param  {Array} templateMap A DOM tree map of the template content
 * @param  {Array} domMap      A DOM tree map of the existing DOM node
 * @param  {Node}  elem        The element to render content into
 */
var diff = function (templateMap, domMap, elem, automatic) {
	// If extra elements in domMap, remove them
	var count = domMap.length - templateMap.length;
	if (count > 0) {
		for (; count > 0; count--) {
			domMap[domMap.length - count].node.parentNode.removeChild(domMap[domMap.length - count].node);
		}
	}

	// Diff each item in the templateMap
	templateMap.forEach(function (node, index) {

		// If element doesn't exist, create it
		if (!domMap[index]) {
			elem.appendChild(makeElem(templateMap[index]));
			return;
		}

		// If element is not the same type, replace it with new element
		if (templateMap[index].type !== domMap[index].type) {
			domMap[index].node.parentNode.replaceChild(makeElem(templateMap[index]), domMap[index].node);
			return;
		}

		// If attributes are different, update them
		diffAtts(templateMap[index], domMap[index], automatic);

		// If content is different, update it
		if (templateMap[index].content !== domMap[index].content) {
			domMap[index].node.textContent = templateMap[index].content;
		}

		// If target element should be empty, wipe it
		if (domMap[index].children.length > 0 && node.children.length < 1) {
			domMap[index].node.innerHTML = '';
			return;
		}

		// If element is empty and shouldn't be, build it up
		// This uses a document fragment to minimize reflows
		if (domMap[index].children.length < 1 && node.children.length > 0) {
			var fragment = document.createDocumentFragment();
			diff(node.children, domMap[index].children, fragment, automatic);
			elem.appendChild(fragment);
			return;
		}

		// If there are existing child elements that need to be modified, diff them
		if (node.children.length > 0) {
			diff(node.children, domMap[index].children, domMap[index].node, automatic);
		}
	});
};