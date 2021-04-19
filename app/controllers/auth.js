const User = require('../models/User')
const Grid = require('../models/Grid')
const { maxAge } = require('../helpers/constants')
const { handleErrors, createToken } = require('../helpers/functions')

exports.signup_get = (req, res) => res.render('auth/signup')
exports.signup_post = async (req, res) => {
  const { username, email, password } = req.body
  try {
    const user = await User.create({ username, email, password })
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(201).json({ user: user._id })
  } catch (err) {
    const errors = handleErrors(err).auth
    res.status(400).json({ errors })
  }
}

exports.login_get = (req, res) => res.render('auth/login')
exports.login_post = async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await User.login(username, password)
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(200).json({ user: user._id })
  } catch (err) {
    const errors = handleErrors(err).auth
    res.status(400).json({ errors })
  }
}

exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 })
  res.redirect('/')
}

exports.account_get = async (req, res) => {
  const filename = res.locals.user.profileImg.split('/')[2]
  const file = await Grid.findOne({ filename })
  if (file) res.locals.img = file._id

  res.render('auth/account')
}

exports.password_edit = async (req, res) => {
  const { email } = res.locals.user
  const { current, newPass } = req.body
  try {
    const user = await User.changePassword({
      email,
      password: { current, newPass },
    })
    res.status(200).json({ user: user._id })
  } catch (err) {
    const errors = handleErrors(err).auth
    res.status(400).json({ errors })
  }
}

exports.profileimage_edit = async (req, res) => {
  try {
    const { image } = req.body
    await User.editProfileImage(res.locals.user.id, image)
    const file = await Grid.findOne({ filename: image.split('/')[2] })
    const id = file?._id ?? null
    res.status(200).json({ image, id })
  } catch {}
}

exports.account_delete = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.delete(res.locals.user.id, email, password)
    res.cookie('jwt', '', { maxAge: 1 })
    res.status(200).json({ user: user._id })
  } catch (err) {
    const errors = handleErrors(err).auth
    res.status(400).json({ errors })
  }
}
