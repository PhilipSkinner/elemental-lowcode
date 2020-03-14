const
	express 		= require("express"),
	bodyParser 		= require("body-parser"),
	tokenHandler 	= require("../shared/tokenHandler"),
	hotreload 		= require("../shared/hotReload")();

let app = null;
let server = null;
let restarting = false;
const tHandler = tokenHandler(process.env.SIG);

const startup = () => {
	app = express();
	app.use(bodyParser.json());
	app.use(tHandler.tokenCheck.bind(tHandler));
	let service = require("./lib/rulesService")(app);

	service.init(process.env.DIR).then(() => {
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