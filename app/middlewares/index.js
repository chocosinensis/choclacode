'use strict'

/**
 * Maps `res.locals` with `req.params`
 *
 * @param  {...String} params
 * @return {function(import('express').Request, import('express').Response, import('express').NextFunction)}
 */
exports.assignParams = (...params) => (req, res, next) => {
  for (const param of params) res.locals[param] = req.params[param]
  next()
}
