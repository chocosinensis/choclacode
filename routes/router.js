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

root.get('*', checkUser);
root.get('/', home_get);
root.get('/about', about_get);
root.get('/dashboard', requireAuth, dashboard_get);

root.use('/quran', quran);
root.use('/articles', articles);
root.use('/chocolate', chocolate);
root.use('/auth', auth);
root.use('/discuss', discuss);
root.use('/api', api);
root.use('/users', users);

root.get('/403', err403);
root.use(err404);

module.exports = root;
