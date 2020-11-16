const chocolate_get = (req, res) => {
  const chocolates = require('../data/chocolate/index.json');
  res.render('chocolate/home', { title: 'Chocolate', chocolates });
}

const chocolatedetail_get = (req, res) => {
  const { slug } = req.params;
  const choc = require('../data/chocolate/content.json')[slug];
  if (choc)
    res.render('chocolate/details', { title: `${choc.title} - Chocolate`, choc });
  else
    res.redirect('/chocolate');
}

module.exports = { chocolate_get, chocolatedetail_get };
