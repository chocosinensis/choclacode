const Chocolate = require('../../models/Chocolate');

const chocolate_get = (req, res) => {
  const chocolates = Chocolate.find();

  const { raw } = req.query;
  if (raw && raw == 'false')
    return res.render('api/details', {
      title: `API &laquo; Chocolates`,
      json: JSON.stringify(chocolates, null, 2)
    });

  res.json(chocolates);
}

const chocolatedetail_get = (req, res) => {
  try {
    const choc = Chocolate.findById(req.params.slug);

    const { raw } = req.query;
    if (raw && raw == 'false')
      return res.render('api/details', {
        title: `API &laquo; ${choc.title} &laquo; Chocolates`,
        json: JSON.stringify(choc, null, 2)
      });

    res.json(choc);
  } catch {
    res.redirect('/api/chocolate');
  }
}

module.exports = { chocolate_get, chocolatedetail_get };
