const User = require('../models/User');

const users_get = async (req, res) => {
  const users = (await User.find({ deleted: false }))
    .map(({ username, email }) => ({ username, email }));

  res.render('users/home', { title: 'Users', users });
}

const user_get = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username, deleted: false });
  if (!user)
    return res.redirect('/users');

  res.render('users/details', {
    title: `${username}`,
    username, email: user.email,
  });
}

module.exports = { users_get, user_get };
