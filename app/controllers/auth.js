'use strict'

const User = require('../models/User')
const Grid = require('../models/Grid')
const { maxAge } = require('../helpers/constants')
const { handleErrors, createToken } = require('../helpers/functions')
const { logger, error } = require('../helpers/logger')

/**
 * @route GET /auth/signup
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.signup_get = (req, res) => res.render('auth/signup')

/**
 * @route POST /auth/signup
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.signup_post = async (req, res) => {
  const { username, email, password } = req.body
  try {
    const user = await User.create({ username, email, password })
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    logger.log(`New user created: ~@[${user.username}]`)
    res.status(201).json({ user: user._id })
  } catch (err) {
    const errors = handleErrors(err).auth
    error.log(`User creation failed: ~@[${username}]\t${err.stack}`)
    res.status(400).json({ errors })
  }
}

/**
 * @route GET /auth/login
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.login_get = (req, res) => res.render('auth/login')

/**
 * @route POST /auth/login
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.login_post = async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await User.login(username, password)
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    logger.log(`User logged in: ~@[${user.username}]`)
    res.status(200).json({ user: user._id })
  } catch (err) {
    const errors = handleErrors(err).auth
    error.log(`User login failed: ~@[${username}]\t${err.stack}`)
    res.status(400).json({ errors })
  }
}

/**
 * @route GET /auth/login
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 })
  logger.log(`Logging out user: ~@[${res.locals?.user?.username}]`)
  res.redirect('/')
}

/**
 * @route GET /auth/account
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.account_get = async (req, res) => {
  const filename = res.locals.user.profileImg.split('/')[2]
  const file = await Grid.findOne({ filename })
  if (file) res.locals.img = file._id

  res.render('auth/account')
}

/**
 * @route PUT /auth/account
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.password_edit = async (req, res) => {
  const { email, username } = res.locals.user
  const { current, newPass } = req.body
  try {
    const user = await User.changePassword({
      email,
      password: { current, newPass },
    })
    logger.log(`Updated password for user: ~@[${username}]`)
    res.status(200).json({ user: user._id })
  } catch (err) {
    const errors = handleErrors(err).auth
    error.log(`Password updating failed for user: ~@[${username}]\t${err.stack}`)
    res.status(400).json({ errors })
  }
}

/**
 * @route PUT /auth/account/image
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.profileimage_edit = async (req, res) => {
  try {
    const { image } = req.body
    await User.editProfileImage(res.locals.user.id, image)
    const file = await Grid.findOne({ filename: image.split('/')[2] })
    const id = file?._id ?? null
    res.status(200).json({ image, id })
  } catch {}
}

/**
 * @route DELETE /auth/account
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.account_delete = async (req, res) => {
  const { email, password } = req.body
  const { id, username } = res.locals.user
  try {
    const user = await User.delete(id, email, password)
    res.cookie('jwt', '', { maxAge: 1 })
    logger.log(`User deleted: ~@[${username}]`)
    res.status(200).json({ user: user._id })
  } catch (err) {
    const errors = handleErrors(err).auth
    error.log(`User deletion failed: ~@[${username}]\t${err.stack}`)
    res.status(400).json({ errors })
  }
}
