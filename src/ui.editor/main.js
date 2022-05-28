const
    express 			= require("express"),
    path				= require("path"),
    fs 					= require("fs"),
    cookieParser 		= require("cookie-parser"),
    auth 				= require("simple-oauth2"),
    handlebars 			= require("handlebars"),
    sass                = require("express-compile-sass"),
    hostnameResolver 	= require("../support.lib/hostnameResolver")(),
    rateLimit           = require("express-rate-limit");

const proto = process.env.DEFAULT_PROTOCOL ? process.env.DEFAULT_PROTOCOL : "http";

const credentials = {
    client: {
        id: process.env.ADMIN_CLIENT_ID,
        secret: process.env.ADMIN_CLIENT_SECRET
    },
    auth: {
        tokenHost: hostnameResolver.resolveExternalIdentity(),
        tokenPath: "/token",
        authorizePath: "/auth",
    }
};

const refreshingTokenSessionStore = require("../support.lib/refreshingTokenSessionStore")();
const apiProxyHandler = require("../support.lib/apiProxyHandler")({
    "service.kernel"      : hostnameResolver.resolveKernel(),
    "service.api"         : hostnameResolver.resolveAPI(),
    "service.integration" : hostnameResolver.resolveIntegration(),
    "service.interface"   : hostnameResolver.resolveInterface(),
    "service.storage"     : hostnameResolver.resolveStorage(),
    "service.rules"       : hostnameResolver.resolveRules(),
    "service.identity"    : hostnameResolver.resolveIdentity(),
    "service.messaging"   : hostnameResolver.resolveQueue(),
    "service.blob"        : hostnameResolver.resolveBlob(),
});

const oauth2 = auth.create(credentials);
const app = express();

app.use(apiProxyHandler.rawBodyHandler);
app.use(cookieParser());

app.use(sass({
    root: path.join(__dirname, "interface"),
    sourceMap: true,
    sourceComments: false,
    watchFiles: true,
    logToConsole: true
}));

const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MILLISECONDS  || 200,
  max: process.env.RATE_LIMIT_MAX_REQUESTS_IN_WINDOW    || 50
});

// apply rate limiter to all requests
app.use(limiter);

app.get("/", (req, res) => {
    if (req.cookies.session && req.cookies.session !== "undefined") {
        //write the contents of our index.html file
        const template = handlebars.compile(fs.readFileSync(path.join(process.env.DIR, "interface/index.html")).toString("utf8"));
        res.write(template({
            hosts : {
                kernel 		: hostnameResolver.resolveKernel(),
                admin 		: hostnameResolver.resolveAdmin(),
                api 		: hostnameResolver.resolveAPI(),
                integration : hostnameResolver.resolveIntegration(),
                interface 	: hostnameResolver.resolveInterface(),
                storage 	: hostnameResolver.resolveStorage(),
                rules 		: hostnameResolver.resolveRules(),
                identity 	: hostnameResolver.resolveIdentity(),
                messaging 	: hostnameResolver.resolveQueue(),
                blob        : hostnameResolver.resolveBlob(),
            }
        }));
        res.end();
        return;
    }

    const authorizationUri = oauth2.authorizationCode.authorizeURL({
        redirect_uri 	: `${hostnameResolver.resolveAdmin()}/auth`,
        scope 			: "openid roles offline_access",
        prompt          : "consent"
    });

    res.redirect(authorizationUri);
    return;
});

app.use("/proxy", apiProxyHandler.handler(oauth2, "openid roles offline_access"));
app.use("/roles", apiProxyHandler.getRoles(oauth2, "openid roles offline_access"));

app.get("/auth", (req, res) => {
    const tokenConfig = {
        code: req.query.code,
        redirect_uri: `${hostnameResolver.resolveAdmin()}/auth`,
        scope: "openid roles offline_access"
    };

    if (!req.query.code) {
        res.write("Error");
        res.end();
        return;
    }

    oauth2.authorizationCode.getToken(tokenConfig).then((result) => {
        const accessToken = oauth2.accessToken.create(result);

        apiProxyHandler.addTokens(res, accessToken.token);

        res.redirect("/");
    }).catch((err) => {
        res.write("Error");
        res.end();
    });
});

app.get("/logout", (req, res) => {
    refreshingTokenSessionStore.getIdToken(oauth2, "openid roles offline_access", req.cookies.session).then((idToken) => {
        res.clearCookie("session");

        let url = `${hostnameResolver.resolveExternalIdentity()}/session/end?post_logout_redirect_uri=${encodeURIComponent(hostnameResolver.resolveAdmin())}`;

        if (idToken) {
            url = `${url}&id_token_hint=${encodeURIComponent(idToken)}`;
        }

        res.redirect(url);
    });
});

app.use(express.static(path.join(process.env.DIR, "./interface"), {}));
app.use("/documentation", express.static(path.join(process.env.DIR, "../support.documentation"), {}));

console.log("Admin running on", process.env.PORT);
app.listen(process.env.PORT);