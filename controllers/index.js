const Article = require('../models/Article');
const Chocolate = require('../models/Chocolate');

exports.home_get = async (req, res) => {
  const articles = [
    await Article.findById('5fb20ffc2aa4d6132d2248ba'),
    await Article.findById('5fb271b0ca65a63f893903a3')
  ];
  const chocs = Chocolate.find();
  res.render('home', {
    title: 'Home', articles,
    chocs: [chocs[9], chocs[6], chocs[3]]
  });
}

exports.about_get = (req, res) => {
  const about = JSON.stringify(require('../data/about.json'), null, 2);
  res.render('others/about', { title: 'About', about });
}

exports.dashboard_get = async (req, res) => {
  const { user } = res.locals;
  const articles = await Article.find({ 'author.id': user.id, deleted: false });

  res.render('dashboard', { title: 'Dashboard', articles });
}

exports.disscuss_get = (req, res) =>
  res.render('others/discuss', { title: 'Discuss' });
