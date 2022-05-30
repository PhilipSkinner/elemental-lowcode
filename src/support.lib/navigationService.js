const navigationService = function() {
    this.request 	= null;
    this.response 	= null;
    this.url 		= null;
};

navigationService.prototype.navigateTo = function(url) {
    this.url = url;
};

navigationService.prototype.setContext = function(request, response) {
    this.request 	= request;
    this.response 	= response;
};

navigationService.prototype.generateResponseHeaders = function() {
    if (this.url) {
        this.response.setHeader("Location", this.url);
        this.response.status(302);
    }
};

module.exports = function() {
    return new navigationService();
};