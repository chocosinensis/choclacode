'use strict'

const { logger } = require('../helpers/logger')

/**
 * Local `morgan` middleware
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.morgan = (req, res, next) => {
  logger.log(`=:= ${req.originalUrl} =.= ~@[${req.method}] ~~> #{ ${req.hostname} } <| ${req.ip} |>`)
  next()
}

/**
 * Maps `res.locals` with `req.params`
 *
 * @param  {...String} params
 * @return {function(import('express').Request, import('express').Response, import('express').NextFunction)}
 */
// prettier-ignore
exports.assignParams = (...params) => (req, res, next) => {
  for (const param of params) res.locals[param] = req.params[param]
  next()
}

/**
 * Middleware setting the MathJax flag to true
 * to include it as a script
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.mathjax = (req, res, next) => {
  res.locals.mathjax = true
  next()
}
