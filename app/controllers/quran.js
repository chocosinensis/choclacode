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
    const data = Surah.findById(req.params.surah)
    data.surah = data.surah.map(({ num, ara, eng, ban }) => ({
      num,
      ara: show.ara ? ara : undefined,
      eng: show.eng ? eng : undefined,
      ban: show.ban ? ban : undefined,
    }))

    res.render('quran/surah', data)
  } catch {
    next()
  }
}
