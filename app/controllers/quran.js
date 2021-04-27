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
 */
exports.surah_get = (req, res, next) => {
  try {
    const { info, surah } = Surah.findById(req.params.surah)
    res.render('quran/surah', { info, surah })
  } catch {
    next()
  }
}
