const comparitorService = function() {

};

comparitorService.prototype.resolveValue = function(path, data) {
	let current = data;
	let parts = path.replace("$.", "").split(".");
	parts.forEach((p) => {
		if (current) {
			current = current[p];
		}
	});

	if (typeof(current) === "undefined") {
		return path;
	}

	return current;
};

comparitorService.prototype.evaluateComparison = function(facts, comparison) {
	//find the value
	var sourceValue = this.resolveValue(comparison.input, facts);

	if (comparison.operator === "eq") {
		return sourceValue === comparison.value;
	}

	if (comparison.operator === "ne") {
		return sourceValue !== comparison.value;
	}

	if (comparison.operator === "contains") {
		return sourceValue.indexOf(comparison.value) !== -1;
	}

	if (comparison.operator === "does not contain") {
		return sourceValue.indexOf(comparison.value) === -1;
	}

	if (comparison.operator === "gt") {
		return sourceValue > comparison.value;
	}

	if (comparison.operator === "gte") {
		return sourceValue >= comparison.value;
	}

	if (comparison.operator === "lt") {
		return sourceValue < comparison.value;
	}

	if (comparison.operator === "lte") {
		return sourceValue <= comparison.value;
	}

	if (comparison.operator === "is null") {
		return sourceValue === null;
	}

	if (comparison.operator === "is not null") {
		return sourceValue !== null;
	}

	return false;
};

comparitorService.prototype.evaluate = function(facts, comparitors) {
	return comparitors.reduce((allTrue, comparison) => {
		return allTrue && this.evaluateComparison(facts, comparison);
	}, true);
};

module.exports = function() {
	return new comparitorService();
};