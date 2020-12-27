const marked = require('marked');

const Article = require('../models/Article');
const { handleErrors, toDate } = require('../config/functions');

const articles_get = (req, res) => Article.find()
  .then((articles) => res.render('articles/home', { title: 'Articles', articles }))
  .catch(console.log);

const createarticle_get = (req, res) => res.render('articles/create', { title: 'Create Article' });
const createarticle_post = async (req, res) => {
  const { title, body, slug } = req.body;
  const { id, username } = res.locals.user;
  try {
    const article = await Article.create({ 
      title, body, slug, 
      author: { id, name: username }, 
      createdAt: toDate(new Date())
    });
    res.status(201).json({ article: article._id });
  } catch (err) {
    const errors = handleErrors(err).article;
    res.status(400).json({ errors });
  }
}

const article_get = (req, res) => Article.findOne({ slug: req.params.slug })
  .then(({ title, body, slug, author, createdAt }) => res.render('articles/details', { 
    title: `${title} - ${author.name}`,
    article: { title, body: marked(body), slug, author, createdAt }
  })).catch(() => res.redirect('/articles'));

const editarticle_get = async (req, res) => {
  const { id, username } = res.locals.user;
  const { slug } = req.params;
  const article = await Article.findOne({ slug, 'author.id': id, 'author.name': username });
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
  const { slug } = req.params;
  const { id, username } = res.locals.user;
  try {
    const article = await Article.findOne({ slug, 'author.id': id, 'author.name': username });
    article.title = title;
    article.body = body;
    article.save();
    res.status(201).json({ article: article._id });
  } catch (err) {
    const errors = handleErrors(err).article;
    res.status(400).json({ errors });
  }
}

const deletearticle = (req, res) => {
  const { slug } = req.params;
  const { id, username } = res.locals.user;
  Article.findOneAndDelete({ slug, 'author.id': id, 'author.name': username })
    .then(() => res.json({ redirect: '/articles' }))
    .catch(() => res.json({ redirect: '/articles' }));
}

module.exports = {
  articles_get,
  createarticle_get, createarticle_post,
  article_get,
  editarticle_get, editarticle_put,
  deletearticle
}
