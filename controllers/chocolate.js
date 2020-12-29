const Chocolate = require('../models/Chocolate');

const chocolate_get = (req, res) => {
  const chocolates = Chocolate.find();
  res.render('chocolate/home', { title: 'Chocolate', chocolates });
}

const chocolatedetail_get = (req, res) => {
  try {
    const choc = Chocolate.findById(req.params.slug);
    res.render('chocolate/details', { title: `${choc.title} - Chocolate`, choc });
  } catch {
    res.redirect('/chocolate');
  }
}

module.exports = { chocolate_get, chocolatedetail_get };
