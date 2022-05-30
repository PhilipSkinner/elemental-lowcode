var historyHandler = function() {

};

historyHandler.prototype.handleEvent = function(event) {
    //load the response
    window.axios.get(`${window.location.href}`, {
        withCredentials : true
    }).then((response) => {
        this.handleResponse(response);
    });

    return false;
};

historyHandler.prototype.handleResponse = function(response) {
    var newMap = createDOMMap(stringToHTML(response.data));
    var domMap = createDOMMap(document.querySelector("html"));
    diff(newMap[1].children, domMap, document.querySelector("html"));

    enhanceForms();
    enhanceLinks();
};


var _historyHandler = new historyHandler();
window.addEventListener("popstate", _historyHandler.handleEvent.bind(_historyHandler));