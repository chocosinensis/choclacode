const { Router } = require('express');

const {
  articles_get,
  createarticle_get, createarticle_post,
  article_get,
  editarticle_get, editarticle_put,
  deletearticle
} = require('../controllers/articles');
const { requireAuth, checkUser } = require('../resources/middlewares/auth');

const articles = Router();

articles
  .get('/', articles_get)

  .get('/create', requireAuth, createarticle_get)
  .post('/create', requireAuth, checkUser, createarticle_post)

  .get('/:slug', article_get)

  .get('/:slug/edit', requireAuth, editarticle_get)
  .put('/:slug/edit', requireAuth, checkUser, editarticle_put)

  .delete('/:slug/delete', requireAuth, checkUser, deletearticle);

module.exports = articles;
