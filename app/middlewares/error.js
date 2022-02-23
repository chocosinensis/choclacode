'use strict'

const { error } = require('../helpers/logger')

/**
 * Returns a middleware redirecting to the error page
 *
 * @param {Number | String} status
 * @param {String} detail
 * @param {Error} err
 * @return {function(import('express').Request, import('express').Response, import('express').NextFunction)}
 */
exports.error = (status, detail, err = null) => (req, res, next) => {
  error.log(`=:= ${req.originalUrl} ~@[${status}] ~~> ${detail}: ${err?.stack ?? '<! no_error !>'}`)
  if (res.headersSent) next(err)
  res.status(status).render('others/error', {
    status,
    detail,
    err: process.env.NODE_ENV === 'development' ? err : undefined,
  })
}

/**
 * Error handling middleware
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.errorHandler = (err, req, res, next) => this.error(500, 'Internal Server Error', err)(req, res, next)
