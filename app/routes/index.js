const { Router } = require('express')

const {
  home_get,
  about_get,
  dashboard_get,
  disscuss_get,
} = require('../controllers')
const { requireAuth, checkUser } = require('../middlewares/auth')
const { err403, err404, errorHandler } = require('../middlewares/error')

const root = Router()

root
  .get('*', checkUser)
  .get('/', home_get)
  .get('/about', about_get)
  .get('/dashboard', requireAuth, dashboard_get)
  .get('/discuss', requireAuth, disscuss_get)

  .use('/quran', require('./quran'))
  .use('/articles', require('./articles'))
  .use('/chocolate', require('./chocolate'))
  .use('/auth', require('./auth'))
  .use('/images', require('./images'))
  .use('/api', require('./api'))
  .use('/users', require('./users'))

  .get('/403', err403)
  .use(err404, errorHandler)

module.exports = root
