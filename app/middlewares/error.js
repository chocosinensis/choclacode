'use strict'

/**
 * Returns a middleware redirecting to the error page
 *
 * @param {Number | String} status
 * @param {String} detail
 * @return {function(import('express').Request, import('express').Response)}
 */
exports.error = (status, detail, err = null) => (req, res) =>
  res.status(status).render('others/error', {
    status,
    detail,
    err: process.env.NODE_ENV === 'development' ? err : undefined,
  })

/**
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.errorHandler = (err, req, res, next) =>
  this.error(500, 'Internal Server Error', err)(req, res)
