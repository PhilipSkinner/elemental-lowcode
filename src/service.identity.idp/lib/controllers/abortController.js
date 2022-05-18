const abort = function(provider) {
    this.provider = provider;
};

abort.prototype.abortRequest = function(req, res, next) {
    this.provider.interactionFinished(req, res, {
        error                   : 'access_denied',
        error_description       : 'End-User aborted interaction',
    }, {
        mergeWithLastSubmission : false
    }).catch((err) => {
        next(err);
    });
};

module.exports = function(provider) {
    return new abort(provider);
};