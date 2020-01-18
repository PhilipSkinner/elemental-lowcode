module.exports = function() {
	const dbConnection = function() {

	};

	dbConnection.prototype.getConnection = function() {
		return "connection";
	};

	return new dbConnection();
};