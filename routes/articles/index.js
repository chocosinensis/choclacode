const { Router } = require('express')

const {
  articles_get,
  createarticle_get,
  createarticle_post,
} = require('../../controllers/articles')
const { assignParams } = require('../../resources/middlewares')
const { requireAuth, checkUser } = require('../../resources/middlewares/auth')

const articles = Router()

articles
  .get('/', articles_get)

  .get('/create', requireAuth, createarticle_get)
  .post('/create', requireAuth, checkUser, createarticle_post)

  .use('/:slug', assignParams('slug'), require('./slug'))

module.exports = articles
