const { Router } = require('express');

const {
  articles_get,
  createarticle_get, createarticle_post,
  article_get,
  editarticle_get, editarticle_put,
  deletearticle
} = require('../controllers/articles');
const { requireAuth } = require('../middlewares/auth');

const articles = Router();

articles.get('/', articles_get);

articles.get('/create', requireAuth, createarticle_get);
articles.post('/create', requireAuth, createarticle_post);

articles.get('/:slug', article_get);

articles.get('/edit/:slug', requireAuth, editarticle_get);
articles.put('/edit/:slug', requireAuth, editarticle_put);

articles.delete('/delete/:slug', requireAuth, deletearticle);

module.exports = articles;
