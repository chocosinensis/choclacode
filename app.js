const express = require('express');

const { listen, config } = require('./config');

const app = express();

listen(app);
config(app);
