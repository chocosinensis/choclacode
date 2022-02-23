'use strict'

const { verify } = require('jsonwebtoken')

const User = require('../models/User')
const { error } = require('../helpers/logger')

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Error | null} err
 * @private
 */
const logandrespond = (req, res, err = null) => {
  const redirect = `/auth/login?next=${req.originalUrl}`
  error.log(`Unauthorized access: =:= ${req.originalUrl}:\t${err?.stack ?? '<! no_error !>'}`)
  res.redirect(redirect)
}

/**
 * Requires that a user is logged in and has a valid token
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) logandrespond(req, res, err)
      else next()
    })
  } else logandrespond(req, res, new Error('Invalid JWT Token'))
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
    verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
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
exports.requireGuest = (req, res, next) => res.locals.user
  ? (() => {
      error.log(`Unauthorized access: =:= ${req.originalUrl}`)
      res.redirect(req.query.next ?? '/dashboard')
    })()
  : next()
