'use strict'

const Article = require('../models/Article')
const Chocolate = require('../models/Chocolate')

/**
 * @route GET /
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.home_get = async (req, res) => {
  const articles = await Article.find().limit(2)
  const chocs = Chocolate.find()
  res.render('home', {
    articles:
      articles.length == 2 ? articles : require('../../data/articles.json'),
    chocs: [chocs[9], chocs[6], chocs[3]],
  })
}

/**
 * @route GET /about
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.about_get = (req, res) => {
  const about = JSON.stringify(require('../../data/about.json'), null, 2)
  res.render('others/about', { about })
}

/**
 * @route GET /dashboard
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.dashboard_get = async (req, res) => {
  const { user } = res.locals
  const articles = await Article.find({ 'author.id': user.id, deleted: false })

  res.render('dashboard', { articles })
}

/**
 * @route GET /discuss
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.discuss_get = (req, res) => res.render('others/discuss')
