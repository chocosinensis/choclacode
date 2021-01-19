const { Router } = require('express');

const {
  home_get, about_get, dashboard_get,
  err403, err404
} = require('../controllers/router');
const { requireAuth, checkUser } = require('../middlewares/auth');
const [quran, articles, chocolate, auth, discuss, api, users] = [
  require('./quran'),
  require('./articles'),
  require('./chocolate'),
  require('./auth'),
  require('./discuss'),
  require('./api'),
  require('./users')
];

const root = Router();

root
  .get('*', checkUser)
  .get('/', home_get)
  .get('/about', about_get)
  .get('/dashboard', requireAuth, dashboard_get)

  .use('/quran', quran)
  .use('/articles', articles)
  .use('/chocolate', chocolate)
  .use('/auth', auth)
  .use('/discuss', discuss)
  .use('/api', api)
  .use('/users', users)

  .get('/403', err403)
  .use(err404);

module.exports = root;
