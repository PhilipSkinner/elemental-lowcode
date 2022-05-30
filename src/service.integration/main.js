const
    express 		= require("express"),
    tokenHandler 	= require("../support.lib/tokenHandler"),
    hotreload 		= require("../support.lib/hotReload")(),
    rateLimit       = require("express-rate-limit");

let app = null;
let server = null;
let restarting = false;
const tHandler = tokenHandler();
const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MILLISECONDS  || 200,
    max: process.env.RATE_LIMIT_MAX_REQUESTS_IN_WINDOW    || 50
});

if (!process.env.DIR) {
    throw new Error("Require dir to load configuration from.");
}

const startup = () => {
    app = express();
    app.use(limiter);
    app.use(tHandler.tokenCheck.bind(tHandler));

    let integrationService = require("./lib/integrationService")(app);

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

hotreload.watch(process.env.DIR, reload, () => {
    restarting = false;
});