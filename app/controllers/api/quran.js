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
 * @route GET /api/quran/search
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.search = (req, res) => {
  const { show } = res.locals
  const { term, l, raw } = req.query

  try {
    const lan = ['ara', 'eng', 'ban'].includes(l) ? l : 'eng'
    const ayahs = Surah.search(term, lan, show)

    if (raw && raw == 'false')
      return res.render('api/details', {
        title: 'Search « Quran',
        json: JSON.stringify(ayahs, null, 2),
      })

    if (ayahs.length == 0) res.json({ success: false, msg: 'No Ayahs Found', ayahs })
    else res.json({ success: true, ayahs })
  } catch {
    if (raw && raw == 'false') return res.redirect('/api/quran?raw=false')
    res.json({
      success: false,
      msg: 'Some Error Occured',
    })
  }
}

/**
 * @route GET /api/quran/:surah
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.surah_get = (req, res) => {
  const { surah } = req.params
  const { show } = res.locals
  const { raw } = req.query

  try {
    const surahjson = Surah.findById(surah, show)

    if (raw && raw == 'false')
      return res.render('api/details', {
        title: `${surahjson.info.eng}`,
        json: JSON.stringify(surahjson, null, 2),
      })

    res.json({ success: true, ...surahjson })
  } catch {
    if (raw && raw == 'false') return res.redirect('/api/quran?raw=false')
    res.status(404).json({
      success: false,
      msg: 'Surah Not Found',
    })
  }
}
