exports.api_get = (req, res) => res.render('api/home', { title: 'API' })

exports.quotes_get = (req, res) => {
  const quotes = require('../../data/quotes.json')

  const { raw } = req.query
  if (raw && raw == 'false')
    return res.render('api/details', {
      title: `API &laquo; Quotes`,
      json: JSON.stringify(quotes, null, 2),
    })

  res.json(quotes)
}
