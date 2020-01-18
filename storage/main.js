const 
	express = require('express'),
	bodyParser = require('body-parser');
const app = express();
const backingStore = require('./lib/stores/fsStore')();
const storageEngine = require('./lib/storageEngine')(backingStore, app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));

storageEngine.init('./example').then(() => {
	app.listen(5000);
});

