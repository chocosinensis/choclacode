const Surah = require('../models/Surah')

const surahs = Surah.find()

exports.quran_get = (req, res) => res.render('quran/home', { surahs })
exports.surah_get = (req, res, next) => {
  try {
    const { info, surah } = Surah.findById(req.params.surah)
    res.render('quran/surah', { info, surah })
  } catch {
    next()
  }
}
