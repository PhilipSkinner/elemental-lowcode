module.exports = {
	events : {
		load : function(event) {
			console.log("I have loaded");
		},
		headerClick : function(event) {
			console.log(event);
		}
	}
};