const
	express 		= require("express"),
	path			= require("path"),
	fs 				= require("fs"),
	cookieParser 	= require("cookie-parser"),
	auth 			= require("simple-oauth2");

const credentials = {
	client: {
		id: "elemental_admin",
		secret: process.env.SECRET
	},
	auth: {
		tokenHost: "http://localhost:8008",
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
		res.write(fs.readFileSync(path.join(process.env.DIR, "interface/index.html")));
		res.end();
		return;
	}

	const authorizationUri = oauth2.authorizationCode.authorizeURL({
		redirect_uri 	: "http://localhost:8002/auth",
		scope 			: "openid roles"
	});

	res.redirect(authorizationUri);
	return;
});

app.get("/auth", (req, res) => {
	const tokenConfig = {
		code: req.query.code,
		redirect_uri: "http://localhost:8002/auth",
		scope: "openid roles",
	};

	oauth2.authorizationCode.getToken(tokenConfig).then((result) => {
		const accessToken = oauth2.accessToken.create(result);

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

app.use(express.static(path.join(process.env.DIR, "./interface"), {}));

console.log("Admin running on", process.env.PORT);
app.listen(process.env.PORT);