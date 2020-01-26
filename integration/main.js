const
	express 	= require('express'),
	hotreload 	= require('../shared/hotReload')();

let app = null;
let server = null;
let restarting = false;

const startup = () => {
	app = express();
	let integrationService = require('./services/integrationService')(app);

	//now init our integrations
	integrationService.init(process.env.DIR).then(() => {
		//and run our app
		server = app.listen(process.env.PORT, () => {
			console.log("Hotreload complete");
			restarting = false;
		});
	});
};

const reload = () => {
	if (!restarting) {
		restarting = true;
		if (server) {
			console.log("Closing...");
			server.close(startup);
		} else {
			startup();
		}
	}
};

hotreload.watch(process.env.DIR, reload);
hotreload.watch('./lib', reload);