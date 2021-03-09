const discussget = (req, res) => res.render('others/discuss', {
  title: 'Discuss', socket: true
});

module.exports = { discussget };
