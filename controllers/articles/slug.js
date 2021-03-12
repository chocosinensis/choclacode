const marked = require('marked');

const Article = require('../../models/Article');
const { handleErrors } = require('../../resources/helpers/functions');

const article_get = (req, res) => Article.findOne({ slug: res.locals.slug, deleted: false })
  .then(({ title, body, slug, author, createdAt }) => res.render('articles/details', { 
    title: `${title} &laquo; ${author.name}`,
    article: { title, body: marked(body), slug, author, createdAt }
  })).catch(() => res.redirect('/articles'));

const editarticle_get = async (req, res) => {
  const { id, username } = res.locals.user;
  const { slug } = res.locals;
  const article = await Article.findOne({
    slug, 'author.id': id, 'author.name': username,
    deleted: false
  });
  if (article)
    res.render('articles/edit', {
      title: 'Edit Article',
      article: { title: article.title, raw: article.body, body: marked(article.body) }
    });
  else
    res.redirect('/articles');
}
const editarticle_put = async (req, res) => {
  const { title, body } = req.body;
  const { slug } = res.locals;
  const { id, username } = res.locals.user;
  try {
    const article = await Article.edit({
      slug, id, username,
      title, body
    });
    res.status(201).json({ article: article._id });
  } catch (err) {
    const errors = handleErrors(err).article;
    res.status(400).json({ errors });
  }
}

const deletearticle = (req, res) => {
  const { slug } = res.locals;
  const { id, username } = res.locals.user;
  Article.delete(slug, id, username)
    .then(() => res.json({ redirect: '/articles' }))
    .catch(() => res.json({ redirect: '/articles' }));
}

module.exports = {
  article_get,
  editarticle_get, editarticle_put,
  deletearticle
};
