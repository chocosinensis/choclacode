const Chocolate = require('../models/Chocolate')
const { err404 } = require('../middlewares/error')

exports.chocolate_get = (req, res) => {
  const chocolates = Chocolate.find()
  res.render('chocolate/home', { title: 'Chocolate', chocolates })
}

exports.chocolatedetail_get = (req, res) => {
  try {
    const choc = Chocolate.findById(req.params.slug)
    res.render('chocolate/details', {
      title: `${choc.title} - Chocolate`,
      choc,
    })
  } catch {
    err404(req, res)
  }
}
