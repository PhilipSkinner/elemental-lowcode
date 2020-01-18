const stringParser = function() {

};

stringParser.prototype._determineReplacementValue = function(name, variables) {
	//get its parts
	var parts = name.replace('$(', '').replace(')', '').replace('[', '.').replace(']', '').split('.');

	var currentLevel = variables;
	//lookup time
	parts.forEach((p) => {
		if (currentLevel[p]) {
			currentLevel = currentLevel[p];
		}
	});

	if (typeof(currentLevel) !== "object" || currentLevel === null) {
		return currentLevel;
	}

	return null;
};

stringParser.prototype.parseString = function(string, variables) {
	var regex = /\$\([\w\.\]\[\d+\]]*\)/g;
	var needsReplacement = false;
	var replacements = [];

	while ((m = regex.exec(string)) !== null) {
	    if (m.index === regex.lastIndex) {
	        regex.lastIndex++;
	    }

	    // The result can be accessed through the `m`-variable.
	    m.forEach((match, groupIndex) => {
	        //find our substitutions
	        var replacementValue = this._determineReplacementValue(match, variables);

	        if (!replacementValue) {
	        	console.log(`Could not find a variable for ${match} in ${string}`);
	        } else {
	        	console.log(`Replacing ${match} in ${string}`);
	        	replacements.push([match, replacementValue]);
	        	needsReplacement = true;
	        }
	    });
	}

	if (needsReplacement) {
		replacements.forEach((r) => {
			string = string.replace(r[0], r[1]);
		});		
	}

	return string;
};

module.exports = function() {
	return new stringParser();
};