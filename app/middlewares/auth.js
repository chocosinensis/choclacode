'use strict'

const { verify } = require('jsonwebtoken')

const User = require('../models/User')

const { JWT_SECRET } = process.env

/**
 * Requires that a user is logged in and has a valid token
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
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

/**
 * Checks whether a user is logged in or not
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
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

/**
 * Requires that no user is currently logged in
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.requireGuest = (req, res, next) =>
  res.locals.user ? res.redirect(req.query.next ?? '/dashboard') : next()
