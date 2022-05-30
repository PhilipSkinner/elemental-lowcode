const
    express 		= require("express"),
    bodyParser 		= require("body-parser"),
    cookieParser 	= require("cookie-parser"),
    path 			= require("path"),
    fileUpload 		= require("express-fileupload"),
    hotreload 		= require("../support.lib/hotReload")();

let app = null;
let server = null;
let restarting = false;

if (!process.env.DIR) {
    throw new Error("Require dir to load configuration from.");
}

const startup = () => {
    return new Promise((resolve, reject) => {
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
        app.use("/_static", express.static(path.join(__dirname, "static")));
        app.use("/", express.static(path.join(__dirname, "static")));

        let websiteService 	= require("./lib/websiteService")(app);

        websiteService.init(process.env.DIR).then(() => {
            console.log(`application trying to listen on port ${process.env.PORT}...`);
            server = app.listen(process.env.PORT, () => {
                console.log("Hotreload complete");
                restarting = false;
                resolve();
            });
            server.on("error", (err) => {
                reject(err);
            });
        }).catch(reject);
    });
};

const reload = () => {
    if (!restarting) {
        return new Promise((resolve, reject) => {
            restarting = true;
            if (server) {
                console.log("Closing...");
                server.close(() => {
                    startup().then(resolve).catch(reject);
                });
            } else {
                startup().then(resolve).catch(reject);
            }
        });
    }
};

hotreload.watch([
    process.env.DIR,
    path.join(process.env.DIR, "../identity/**/*.json")
], reload, () => {
    restarting = false;
});