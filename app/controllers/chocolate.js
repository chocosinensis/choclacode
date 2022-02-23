'use strict'

const Chocolate = require('../models/Chocolate')

/**
 * @route GET /chocolate
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.chocolate_get = (req, res) => {
  const chocolates = Chocolate.find()
  res.render('chocolate/home', { chocolates })
}

/**
 * @route GET /chocolate/:slug
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.chocolatedetail_get = (req, res, next) => {
  try {
    const choc = Chocolate.findById(req.params.slug)
    res.render('chocolate/details', { choc })
  } catch {
    next()
  }
}
