const express = require('express');
const app = express();
const integrationService = require('./services/integrationService')(app);

//now init our integrations
integrationService.init('./example').then(() => {
	//and run our app
	app.listen(3000);
});
