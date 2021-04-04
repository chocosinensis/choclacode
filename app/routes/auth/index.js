const { Router } = require('express')

const { logout_get } = require('../../controllers/auth')
const {
  requireAuth,
  checkUser,
  requireGuest,
} = require('../../middlewares/auth')

const auth = Router()

auth
  .use('/signup', requireGuest, require('./signup'))
  .use('/login', requireGuest, require('./login'))
  .get('/logout', requireAuth, logout_get)
  .use('/account', requireAuth, checkUser, require('./account'))

module.exports = auth
