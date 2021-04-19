const Chocolate = require('../models/Chocolate')

exports.chocolate_get = (req, res) => {
  const chocolates = Chocolate.find()
  res.render('chocolate/home', { chocolates })
}

exports.chocolatedetail_get = (req, res, next) => {
  try {
    const choc = Chocolate.findById(req.params.slug)
    res.render('chocolate/details', { choc })
  } catch {
    next()
  }
}
