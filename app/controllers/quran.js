const Surah = require('../models/Surah')
const { err404 } = require('../middlewares/error')

const surahs = Surah.find()

exports.quran_get = (req, res) =>
  res.render('quran/home', { title: 'Quran', surahs })
exports.surah_get = (req, res) => {
  try {
    const { info, surah } = Surah.findById(req.params.surah)
    res.render('quran/surah', {
      title: `${info.eng} &laquo; ${info.ara}`,
      info,
      surah,
    })
  } catch {
    err404(req, res)
  }
}
