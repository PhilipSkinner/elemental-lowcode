const
	express 		= require("express"),
	bodyParser 		= require("body-parser"),
	cookieParser 	= require("cookie-parser"),
	path 			= require("path"),
	fileUpload 		= require("express-fileupload"),
	hotreload 		= require("../shared/hotReload")();

let app = null;
let server = null;
let restarting = false;

const startup = () => {
	app = express();
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended : false }));
	app.use(cookieParser());
	app.use(fileUpload({
  		limits			: { fileSize: 50 * 1024 * 1024 },
  		useTempFiles 	: true,
    	tempFileDir 	: "./.tmp/"
	}));

	//init our global statics
	app.use(`/_static`, express.static(path.join(__dirname, "static")));

	let websiteService 	= require("./lib/websiteService")(app);

	websiteService.init(process.env.DIR).then(() => {
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

hotreload.watch([
	process.env.DIR,
	path.join(process.env.DIR, '../identity/**/*.json')
], reload, () => {
  restarting = false;
});