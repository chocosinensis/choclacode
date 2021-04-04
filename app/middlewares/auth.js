const { verify } = require('jsonwebtoken')

const User = require('../models/User')

const { JWT_SECRET } = process.env

exports.requireAuth = (req, res, next) => {
  const redirect = `/auth/login?next=${req.originalUrl}`
  const token = req.cookies.jwt
  if (token) {
    verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) res.redirect(redirect)
      else next()
    })
  } else res.redirect(redirect)
}

exports.checkUser = (req, res, next) => {
  if (res.locals.user) return next()

  const token = req.cookies.jwt
  if (token) {
    verify(token, JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null
        next()
      } else {
        let user = await User.findById(decodedToken.id)
        res.locals.user = user
        next()
      }
    })
  } else {
    res.locals.user = null
    next()
  }
}

exports.requireGuest = (req, res, next) => {
  res.locals.user ? res.redirect(req.query.next ?? '/dashboard') : next()
}
