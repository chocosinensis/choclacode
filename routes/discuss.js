const { Router } = require('express');

const { discussget } = require('../controllers/discuss');
const { requireAuth } = require('../middlewares/auth');

const discussRouter = Router();

discussRouter.get('/', requireAuth, discussget);

module.exports = discussRouter;
