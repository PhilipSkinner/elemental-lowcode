const express = require('express');
const app = express();
const integrationService = require('./services/integrationService')(app);

//now init our integrations
integrationService.init(process.env.DIR).then(() => {
	//and run our app
	app.listen(process.env.PORT);
});
