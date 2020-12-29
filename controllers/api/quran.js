const Surah = require('../../models/Surah');

const quran_get = (req, res) => {
  const surahs = Surah.find();

  res.json(surahs);
}

const surah_get = (req, res) => {
  const { surah } = req.params;

  try {
    const surahjson = Surah.findById(surah);
    res.json(surahjson);
  } catch {
    res.redirect('/api/quran');
  }
}

module.exports = { quran_get, surah_get };
