const express = require('express');
const app = express();
const websiteService = require('./lib/websiteService')(app);

websiteService.init('./example/website.json').then(() => {
	console.log("running!");
	app.listen(6001);
});