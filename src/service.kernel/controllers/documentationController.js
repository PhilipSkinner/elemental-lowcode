const documentationController = function(app, find, path) {
    this.app                = app;
    this.find               = find;
    this.path               = path;

    this.initEndpoints();
};

documentationController.prototype.get = function(req, res) {
    const query = req.query.query;

    if (typeof(query) === "undefined" || query === null || query.length <= 3) {
        res.json(null);
        return;
    }

    this.find.find(query, this.path.join(__dirname, "../../support.documentation/")).then((results) => {
        res.status(200);
        const final = [];
        for (const file in results) {
            results[file].file = file.replace(this.path.join(__dirname, "../../support.documentation/"), "/src/support.documentation/");
            final.push(results[file]);
        }
        res.json(final);
        res.end();
    }).catch((err) => {
        res.status(500);
        res.json({
            errors : [
                err.toString()
            ]
        });
        res.end();
    });
};

documentationController.prototype.initEndpoints = function() {
    if (!this.app) {
        return;
    }

    this.app.get("/documentation", this.get.bind(this));
};

module.exports = function(app, find, path) {
    if (!find) {
        find = require("find-in-files");
    }

    if (!path) {
        path = require("path");
    }

    return new documentationController(app, find, path);
};