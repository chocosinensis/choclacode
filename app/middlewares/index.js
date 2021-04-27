'use strict'

/**
 * Maps `res.locals` with `req.params`
 *
 * @param  {...String} params
 */
exports.assignParams = (...params) => (req, res, next) => {
  for (const param of params) res.locals[param] = req.params[param]
  next()
}
