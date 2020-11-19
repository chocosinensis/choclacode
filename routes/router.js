const { Router } = require('express');

const {
  home_get, about_get,
  err403, err404
} = require('../controllers/router');
const { checkUser } = require('../middlewares/auth');
const [quran, articles, chocolate, auth, discuss, api] = [
  require('./quran'),
  require('./articles'),
  require('./chocolate'),
  require('./auth'),
  require('./discuss'),
  require('./api')
];

const root = Router();

root.get('*', checkUser);
root.get('/', home_get);
root.get('/about', about_get);

root.use('/quran', quran);
root.use('/articles', articles);
root.use('/chocolate', chocolate);
root.use('/auth', auth);
root.use('/discuss', discuss);
root.use('/api', api);

root.get('/403', err403);
root.use(err404);

module.exports = root;
