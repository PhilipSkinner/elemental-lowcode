const
    express 		= require("express"),
    path 			= require("path"),
    hotreload 		= require("../support.lib/hotReload")(),
    bodyParser 		= require("body-parser"),
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

if (!process.env.PORT) {
    process.env.PORT = 5000;
}

let queueService = null;

const startup = () => {
    return new Promise((resolve, reject) => {
        app = express();

        queueService = require("./lib/queueService")(app);

        app.use(limiter);
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended : false }));

        queueService.init(process.env.DIR).then(() => {
            console.log(`application trying to listen on port ${process.env.PORT}...`);
            server = app.listen(process.env.PORT, () => {
                console.log("Hotreload complete");
                restarting = false;
                resolve()
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
            if (queueService && queueService.terminateInstances) {
                queueService.terminateInstances();
            }

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