const interactionController = function(provider) {
    this.provider = provider;
};

interactionController.prototype.handleInteraction = function(req, res, next) {
    this.provider.interactionDetails(req, res).then((details) => {
        let pageName = details.prompt.name;
        if (details.lastSubmission && details.lastSubmission.prompt) {
            pageName = details.lastSubmission.prompt;
        }

        if (pageName === "login") {
            res.redirect(`/interaction/${req.params.uid}/login`);
            return;
        }

        if (pageName === "register") {
            res.redirect(`/interaction/${req.params.uid}/register`);
            return;
        }

        if (pageName === "consent") {
            res.redirect(`/interaction/${req.params.uid}/consent`);
            return;
        }

        if (pageName === "terms") {
            res.redirect(`/interaction/${req.params.uid}/terms`);
            return;
        }

        if (pageName == "password") {
            res.redirect(`/interaction/${req.params.uid}/password`);
            return;
        }

        if (pageName == "forgotten") {
            res.redirect(`/interaction/${req.params.uid}/forgotten`);
            return;
        }

        if (pageName == "code") {
            res.redirect(`/interaction/${req.params.uid}/code`);
            return;
        }

        //otherwise we redirect to the abort screen
        res.redirect(`/interaction/${req.params.uid}/abort`);
        return;
    }).catch((err) => {
        next(err);
    });
};

module.exports = function(provider) {
    return new interactionController(provider);
};