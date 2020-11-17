const { Router } = require('express');

const {
  articles_get,
  createarticle_get, createarticle_post,
  article_get,
  editarticle_get, editarticle_put,
  deletearticle
} = require('../controllers/articles');
const { requireAuth } = require('../middlewares/auth');

const articlesRouter = Router();

articlesRouter.get('/', articles_get);

articlesRouter.get('/create', requireAuth, createarticle_get);
articlesRouter.post('/create', requireAuth, createarticle_post);

articlesRouter.get('/:slug', article_get);

articlesRouter.get('/edit/:slug', requireAuth, editarticle_get);
articlesRouter.put('/edit/:slug', requireAuth, editarticle_put);

articlesRouter.delete('/delete/:slug', requireAuth, deletearticle);

module.exports = articlesRouter;
