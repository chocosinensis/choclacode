const { Router } = require('express');

const {
  home_get, about_get,
  err403, err404
} = require('../controllers/router');
const { checkUser } = require('../middlewares/auth');
const [
  auth, articles, discuss,
  api, quran, chocolate
] = [
  require('./auth'),
  require('./articles'),
  require('./discuss'),
  require('./api'),
  require('./quran'),
  require('./chocolate')
];

const root = Router();

root.get('*', checkUser);
root.get('/', home_get);
root.get('/about', about_get);

root.use('/auth', auth);
root.use('/articles', articles);
root.use('/discuss', discuss);
root.use('/api', api);
root.use('/quran', quran);
root.use('/chocolate', chocolate);

root.get('/403', err403);
root.use(err404);

module.exports = root;
