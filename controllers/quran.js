const Surah = require('../models/Surah');

const surahs = Surah.find();

exports.quran_get = (req, res) => res.render('quran/home', { title: 'Quran', surahs });
exports.surah_get = (req, res) => {
  try {
    const surah = Surah.findById(req.params.surah);
    let info;
    surahs.forEach((list) => list.forEach(({ num, eng, ara }) => {
      if (num == req.params.surah) info = { num, eng, ara };
    }));
    res.render('quran/surah', {
      title: `${info.eng} &laquo; ${info.ara}`,
      info, surah
    });
  } catch {
    res.redirect('/quran');
  }
}
