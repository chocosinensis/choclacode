'use strict'

const Surah = require('../models/Surah')

const surahs = Surah.find()

/**
 * @route GET /quran
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.quran_get = (req, res) => res.render('quran/home', { surahs })

/**
 * @route GET /quran/:surah
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.surah_get = (req, res, next) => {
  const { show } = res.locals

  try {
    const data = Surah.findById(req.params.surah, show)

    res.render('quran/surah', data)
  } catch {
    next()
  }
}
