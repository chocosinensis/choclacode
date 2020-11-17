const express = require('express');

const { listen, config } = require('./config');
const rootRouter = require('./routes/router');

const app = express();

listen(app);
config(app);
app.use(rootRouter);
