'use strict'

const { Router } = require('express')

const {
  article_get,
  editarticle_get,
  editarticle_put,
  deletearticle,
  like_post,
} = require('../../controllers/articles/slug')
const { mathjax } = require('../../middlewares')
const { requireAuth, checkUser } = require('../../middlewares/auth')

const slug = Router()

slug
  .get('/', mathjax, article_get)

  .get('/edit', requireAuth, mathjax, editarticle_get)
  .put('/edit', requireAuth, checkUser, editarticle_put)

  .delete('/delete', requireAuth, checkUser, deletearticle)

  .post('/like', requireAuth, checkUser, like_post)

module.exports = slug
