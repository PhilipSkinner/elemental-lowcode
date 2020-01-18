const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(process.env.DIR, './interface'), {}));

console.log("Admin running on", process.env.PORT);
app.listen(process.env.PORT);