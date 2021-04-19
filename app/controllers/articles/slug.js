const marked = require('marked')

const Article = require('../../models/Article')
const { getArticleBySlug, getArticle } = require('../../services/articles')
const { handleErrors } = require('../../helpers/functions')
const { error } = require('../../middlewares/error')

exports.article_get = (req, res) =>
  getArticleBySlug(res.locals.slug)
    .then((article) => res.render('articles/details', { article }))
    .catch(() => error(404, 'Not Found')(req, res))

exports.editarticle_get = async (req, res) => {
  const { id, username } = res.locals.user
  const { slug } = res.locals
  const article = await getArticle({
    slug,
    'author.id': id,
    'author.name': username,
  })
  if (article)
    res.render('articles/edit', {
      article: {
        title: article.title,
        raw: article.body,
        body: marked(article.body),
      },
    })
  else err404(req, res)
}
exports.editarticle_put = async (req, res) => {
  const { title, body } = req.body
  const { slug } = res.locals
  const { id, username } = res.locals.user
  try {
    const article = await Article.edit({
      slug,
      id,
      username,
      title,
      body,
    })
    res.status(200).json({ article: article._id })
  } catch (err) {
    const errors = handleErrors(err).article
    res.status(400).json({ errors })
  }
}

exports.deletearticle = (req, res) => {
  const { slug } = res.locals
  const { id, username } = res.locals.user
  Article.delete(slug, id, username)
    .then(() => res.status(200).json({ redirect: '/articles' }))
    .catch(() => res.status(400).json({ redirect: '/articles' }))
}

exports.like_post = (req, res) => {
  const { slug } = res.locals
  const { id, username } = res.locals.user
  Article.like(slug, id, username)
    .then(({ likes, status }) => res.status(status).json({ likes }))
    .catch((err) => res.status(400).json({ errors: handleErrors(err).article }))
}
