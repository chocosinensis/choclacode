'use strict'

/**
 * Returns a middleware redirecting to the error page
 *
 * @param {Number | String} status
 * @param {String} detail
 */
exports.error = (status, detail) => (req, res) =>
  res.status(status).render('others/error', { status, detail })

/**
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.errorHandler = (err, req, res, next) =>
  this.error(500, 'Internal Server Error')(req, res)
