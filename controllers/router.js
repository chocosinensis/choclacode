const Article = require('../models/Article');
const { jsonify } = require('../config/functions');

const home_get =  async (req, res) => {
  const articles = [
    await Article.findById('5fb271b0ca65a63f893903a3'),
    await Article.findById('5fb20ffc2aa4d6132d2248ba')
  ];
  const chocs = require('../data/chocolate/index.json');
  res.render('home', {
    title: 'Home', articles,
    chocs: [chocs[9], chocs[6], chocs[3]]
  });
}
const about_get = (req, res) => {
  const about = jsonify(require('../data/about.json'));
  res.render('others/about', { title: 'About', about });
}

const err403 = (req, res) => res.status(403)
  .render('others/error', {
    title: '403 - Forbidden',
    status: 403,
    detail: 'Forbidden'
  });
const err404 = (req, res) => res.status(404)
  .render('others/error', {
    title: '404 - Not Found',
    status: 404,
    detail: 'Not Found'
  });

module.exports = {
  home_get, about_get,
  err403, err404
};
