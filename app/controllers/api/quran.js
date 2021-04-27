'use strict'

const Surah = require('../../models/Surah')

/**
 * @route GET /api/quran
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.quran_get = (req, res) => {
  const surahs = Surah.find()

  const { raw } = req.query
  if (raw && raw == 'false')
    return res.render('api/details', {
      title: 'Quran',
      json: JSON.stringify(surahs, null, 2),
    })

  res.json(surahs)
}

/**
 * @route GET /api/quran/:surah
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.surah_get = (req, res) => {
  const { surah } = req.params

  try {
    const surahjson = Surah.findById(surah)

    const { raw } = req.query
    if (raw && raw == 'false')
      return res.render('api/details', {
        title: `${surahjson.info.eng}`,
        json: JSON.stringify(surahjson, null, 2),
      })

    res.json(surahjson)
  } catch {
    res.redirect('/api/quran')
  }
}
