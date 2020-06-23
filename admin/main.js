const
	express 			= require("express"),
	path				= require("path"),
	fs 					= require("fs"),
	cookieParser 		= require("cookie-parser"),
	auth 				= require("simple-oauth2"),
	handlebars 			= require("handlebars"),
	hostnameResolver 	= require("../shared/hostnameResolver")();

const credentials = {
	client: {
		id: "elemental_admin",
		secret: process.env.SECRET
	},
	auth: {
		tokenHost: hostnameResolver.resolveIdentity(),
		tokenPath: "/token",
		authorizePath: "/auth",
	}
};

const oauth2 = auth.create(credentials);
const app = express();
app.use(cookieParser());

app.get("/", (req, res) => {
	if (req.cookies.token && req.cookies.token !== "undefined") {
		//write the contents of our index.html file
		const template = handlebars.compile(fs.readFileSync(path.join(process.env.DIR, "interface/index.html")).toString('utf8'));
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
				messaging 	: hostnameResolver.resolveQueue()
			}
		}));
		res.end();
		return;
	}

	const authorizationUri = oauth2.authorizationCode.authorizeURL({
		redirect_uri 	: `${hostnameResolver.resolveAdmin()}/auth`,
		scope 			: "openid roles"
	});

	res.redirect(authorizationUri);
	return;
});

app.get("/auth", (req, res) => {
	const tokenConfig = {
		code: req.query.code,
		redirect_uri: `${hostnameResolver.resolveAdmin()}/auth`,
		scope: "openid roles",
	};

	if (!req.query.code) {
		res.write("Error");
		res.end();
		return;
	}

	oauth2.authorizationCode.getToken(tokenConfig).then((result) => {
		const accessToken = oauth2.accessToken.create(result);

		res.clearCookie("token");
		//set the access token as a cookie
		res.cookie("token", accessToken.token.access_token, {
			expires : accessToken.token.expires_at,
		});
		res.redirect("/");
	}).catch((err) => {
		res.write("Error");
		res.end();
	});
});

app.get("/logout", (req, res) => {
	res.clearCookie("token");
	res.redirect("/");
});

app.use(express.static(path.join(process.env.DIR, "./interface"), {}));
app.use("/documentation", express.static(path.join(process.env.DIR, "../documentation"), {}));

console.log("Admin running on", process.env.PORT);
app.listen(process.env.PORT);