const chocolate_get = (req, res) => {
  const chocolates = require('../../data/chocolate/index.json');

  res.json(chocolates);
}

const chocolatedetail_get = (req, res) => {
  const { slug } = req.params;
  const choc = require('../../data/chocolate/content.json')[slug];
  if (choc)
    res.json(choc);
  else
    res.redirect('/api/chocolate');
}

module.exports = { chocolate_get, chocolatedetail_get };
