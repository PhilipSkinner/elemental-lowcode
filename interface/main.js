const express = require('express');
const app = express();
const websiteService = require('./lib/websiteService')(app);

websiteService.init(process.env.DIR).then(() => {	
	app.listen(process.env.PORT);
});