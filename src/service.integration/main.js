const
    express 		= require("express"),
    hotreload 		= require("../support.lib/hotReload")(),
    bodyParser      = require("body-parser"),
    rateLimit       = require("express-rate-limit");

let app = null;
let server = null;
let restarting = false;
const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MILLISECONDS  || 200,
    max: process.env.RATE_LIMIT_MAX_REQUESTS_IN_WINDOW    || 50
});

if (!process.env.DIR) {
    throw new Error("Require dir to load configuration from.");
}

const startup = () => {
    return new Promise((resolve, reject) => {
        app = express();
        app.use(limiter);
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended : false }));

        let integrationService = require("./lib/integrationService")(app);

        //now init our integrations
        integrationService.init(process.env.DIR).then(() => {
            //and run our app
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

hotreload.watch(process.env.DIR, reload, () => {
    restarting = false;
});