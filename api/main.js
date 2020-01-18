const 
	express = require('express'),
	bodyParser = require('body-parser');
const app = express();
const apiService = require('./lib/apiService')(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//load our APIs
apiService.init(['./example/api.json']).then(() => {
	app.listen(4000);
});