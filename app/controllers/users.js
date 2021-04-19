const User = require('../models/User')

exports.users_get = async (req, res) => {
  const users = (
    await User.find({ deleted: false })
  ).map(({ username, email, profileImg }) => ({ username, email, profileImg }))

  res.render('users/home', { users })
}

exports.user_get = async (req, res, next) => {
  const { username } = req.params
  const user = await User.findOne({ username, deleted: false })
  if (!user) return next()

  res.render('users/details', {
    username,
    email: user.email,
    profileImg: user.profileImg,
  })
}
