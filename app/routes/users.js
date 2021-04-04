const { Router } = require('express')

const { users_get, user_get } = require('../controllers/users')
const { requireAuth } = require('../middlewares/auth')

const users = Router()

users.get('/', requireAuth, users_get).get('/@:username', requireAuth, user_get)

module.exports = users
