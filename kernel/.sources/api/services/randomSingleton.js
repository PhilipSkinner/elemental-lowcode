module.exports = function() {
	let num = Math.random();

	const randomGen = function() {

	};

	randomGen.prototype.getNumbers = function() {		
		return {
			"one" : num,
			"two" : Math.random()
		}
	};

	return new randomGen();
};