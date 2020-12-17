const { Router } = require('express');

const { discussget } = require('../controllers/discuss');
const { requireAuth } = require('../middlewares/auth');

const discuss = Router();

discuss.get('/', requireAuth, discussget);

module.exports = discuss;
