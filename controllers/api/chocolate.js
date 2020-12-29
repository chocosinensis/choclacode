const Chocolate = require('../../models/Chocolate');

const chocolate_get = (req, res) => {
  const chocolates = Chocolate.find();

  res.json(chocolates);
}

const chocolatedetail_get = (req, res) => {
  try {
    const choc = Chocolate.findById(req.params.slug);
    res.json(choc);
  } catch {
    res.redirect('/api/chocolate');
  }
}

module.exports = { chocolate_get, chocolatedetail_get };
