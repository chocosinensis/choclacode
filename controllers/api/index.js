const api_get = (req, res) => res.render('others/api', { title: 'API' });

const quotes_get = (req, res) => {
  const quotes = require('../../data/quotes.json');
  res.json(quotes)
}

module.exports = { api_get, quotes_get };
