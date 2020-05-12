const
	express 		= require("express"),
	tokenHandler 	= require("../shared/tokenHandler"),
	hotreload 		= require("../shared/hotReload")();
	bodyParser 		= require("body-parser");

let app = null;
let server = null;
let restarting = false;
let tHandler = tokenHandler(process.env.SIG);

if (!process.env.DIR) {
	process.env.DIR = "./example";
}

if (!process.env.PORT) {
	process.env.PORT = 5000;
}

const startup = () => {
	app = express();

	const apiService = require("./lib/apiService")(app);

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended : false }));
	app.use(tHandler.tokenCheck.bind(tHandler));

	//load our APIs
	apiService.init(process.env.DIR).then(() => {
		console.log("Hotreload complete");
		server = app.listen(process.env.PORT);
		restarting = false;
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