const 
	express = require('express'),
	bodyParser = require('body-parser');

const app = express();
const apiService = require('./lib/apiService')(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));

//load our APIs
apiService.init(process.env.DIR).then(() => {
	app.listen(process.env.PORT);
});