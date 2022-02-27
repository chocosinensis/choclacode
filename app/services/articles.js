'use strict'

const { parse } = require('marked')

const Article = require('../models/Article')

exports.getAllArticles = async () => await Article.find({ deleted: false })

exports.createArticle = async ({ title, body, slug, id, name }) => {
  try {
    const article = await Article.create({
      title,
      body,
      slug,
      author: { id, name },
    })
    return article
  } catch (err) {
    throw err
  }
}

exports.getArticleBySlug = async (slug) => {
  try {
    const { title, body: raw, author, createdAt, likes } = await Article.findOne({
      slug,
      deleted: false,
    })
    const body = parse(raw)
    return { title, raw, body, slug, author, createdAt, likes }
  } catch (err) {
    throw err
  }
}

exports.getArticle = async (params) => await Article.findOne({ ...params, deleted: false })
