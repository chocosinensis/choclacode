const { verify } = require('jsonwebtoken');

const { handleErrors, toDate } = require('../config/functions');
const Article = require('../models/Article');
const User = require('../models/User');

const articles_get = (req, res) => Article.find()
  .then((articles) => res.render('articles/home', { title: 'Articles', articles }))
  .catch(console.log);

const createarticle_get = (req, res) => res.render('articles/create', { title: 'Create Article' });
const createarticle_post = async (req, res) => {
  const { title, body, slug } = req.body;
  const token = req.cookies.jwt;
  verify(token, 'mysecretcodethatisawsome', async (err, decodedToken) => {
    const user = await User.findById(decodedToken.id);
    try {
      const article = await Article.create({ 
        title, body, slug, 
        author: { id: user.id, name: user.username }, 
        createdAt: toDate(new Date())
      });
      res.status(201).json({ article: article._id });
    } catch (err) {
      const errors = handleErrors(err).article;
      res.status(404).json({ errors });
    }
  });
}

const article_get = (req, res) => Article.findOne({ slug: req.params.slug })
  .then((article) => res.render('articles/details', { 
    title: `${article.title} - ${article.author}`, article
  })).catch(() => res.redirect('/articles'));

const editarticle_get = (req, res) => {
  const { id, username } = res.locals.user;
  const { slug } = req.params;
  Article.findOne({ slug, author: { id, name: username } }).then((article) => {
    if (article) res.render('articles/edit', { title: 'Edit Article', article });
    else res.redirect('/articles');
  });
}
const editarticle_put = async (req, res) => {
  const { title, body } = req.body;
  const { slug } = req.params;
  try {
    const article = await Article.findOne({ slug });
    article.title = title;
    article.body = body;
    article.save();
    res.status(201).json({ article: article._id });
  } catch (err) {
    const errors = handleErrors(err).article;
    res.status(404).json({ errors });
  }
}

const deletearticle = (req, res) => {
  const { slug } = req.params;
  const token = req.cookies.jwt;
  verify(token, 'mysecretcodethatisawsome', async (err, decodedToken) => {
    const { id, nickname } = await User.findById(decodedToken.id);
    Article.findOneAndDelete({ slug, author: { id, name: nickname } })
      .then(() => res.json({ redirect: '/articles' }))
      .catch(() => res.json({ redirect: '/articles' }));
  });
}

module.exports = {
  articles_get,
  createarticle_get, createarticle_post,
  article_get,
  editarticle_get, editarticle_put,
  deletearticle
}
