const { Router } = require('express')

const {
  article_get,
  editarticle_get,
  editarticle_put,
  deletearticle,
  like_post,
} = require('../../controllers/articles/slug')
const { requireAuth, checkUser } = require('../../resources/middlewares/auth')

const slug = Router()

slug
  .get('/', article_get)

  .get('/edit', requireAuth, editarticle_get)
  .put('/edit', requireAuth, checkUser, editarticle_put)

  .delete('/delete', requireAuth, checkUser, deletearticle)

  .post('/like', requireAuth, checkUser, like_post)

module.exports = slug
