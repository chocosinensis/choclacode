const { Router } = require('express');

const {
  articles_get,
  createarticle_get, createarticle_post,
  article_get,
  editarticle_get, editarticle_put,
  deletearticle
} = require('../controllers/articles');
const { requireAuth, checkUser } = require('../middlewares/auth');

const articles = Router();

articles.get('/', articles_get);

articles.get('/create', requireAuth, createarticle_get);
articles.post('/create', requireAuth, checkUser, createarticle_post);

articles.get('/:slug', article_get);

articles.get('/:slug/edit', requireAuth, editarticle_get);
articles.put('/:slug/edit', requireAuth, checkUser, editarticle_put);

articles.delete('/:slug/delete', requireAuth, checkUser, deletearticle);

module.exports = articles;
