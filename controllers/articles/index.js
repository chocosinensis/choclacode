const Article = require('../../models/Article');
const { handleErrors, toDate } = require('../../resources/helpers/functions');

const articles_get = (req, res) => Article.find({ deleted: false })
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

module.exports = {
  articles_get,
  createarticle_get, createarticle_post
};
