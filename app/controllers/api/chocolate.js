'use strict'

const Chocolate = require('../../models/Chocolate')

/**
 * @route GET /api/chocolate
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.chocolate_get = (req, res) => {
  const chocolates = Chocolate.find()

  const { raw } = req.query
  if (raw && raw == 'false')
    return res.render('api/details', {
      title: 'Chocolates',
      json: JSON.stringify(chocolates, null, 2),
    })

  res.json(chocolates)
}

/**
 * @route GET /api/chocolate/:slug
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.chocolatedetail_get = (req, res) => {
  try {
    const choc = Chocolate.findById(req.params.slug)

    const { raw } = req.query
    if (raw && raw == 'false')
      return res.render('api/details', {
        title: `${choc.title}`,
        json: JSON.stringify(choc, null, 2),
      })

    res.json(choc)
  } catch {
    res.redirect('/api/chocolate')
  }
}
