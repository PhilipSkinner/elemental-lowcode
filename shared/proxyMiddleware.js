module.exports = (req, res, next) => {
	req.originalUrl = req.url;
	if (req.headers && req.headers["x-root"] && req.url.indexOf(req.headers["x-root"]) === 0) {
		req.url = `/${req.url.slice(req.headers["x-root"].length)}`;
	}

	next();
};