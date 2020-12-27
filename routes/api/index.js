const { Router } = require('express');
const cors = require('cors');

const { api_get, quotes_get } = require('../../controllers/api');
const { requireAuth } = require('../../middlewares/auth');
const [quran, chocolate] = [require('./quran'), require('./chocolate')];

const api = Router();

api.get('/', requireAuth, api_get);

api.use('/quran', cors(), quran);
api.use('/chocolate', cors(), chocolate);
api.get('/quotes', quotes_get);

module.exports = api;
