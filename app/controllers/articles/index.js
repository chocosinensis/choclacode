'use strict'

const { getAllArticles, createArticle } = require('../../services/articles')
const { handleErrors } = require('../../helpers/functions')
const { logger, error } = require('../../helpers/logger')

/**
 * @route GET /articles
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.articles_get = (req, res) =>
  getAllArticles()
    .then((articles) => res.render('articles/home', { articles }))
    .catch(console.log)

/**
 * @route GET /articles/create
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.createarticle_get = (req, res) => res.render('articles/create')

/**
 * @route POST /articles/create
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.createarticle_post = async (req, res) => {
  const { title, body, slug } = req.body
  const { id, username: name } = res.locals.user
  try {
    const article = await createArticle({ title, body, slug, id, name })
    logger.log(`New article created: ~@['${title}'] :.= ${name}`)
    res.status(201).json({ article: article._id })
  } catch (err) {
    const errors = handleErrors(err).article
    error.log(`Article creation failed: ~@['${title}']\t${err.stack}`)
    res.status(400).json({ errors })
  }
}
