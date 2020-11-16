const quran_get = (req, res) => {
  const surahs = require('../../data/quran/surahs.json');

  res.json(surahs);
}

const surah_get = (req, res) => {
  const { surah } = req.params;

  try {
    const surahjson = require(`../../data/quran/${surah}.json`);
    res.json(surahjson);
  } catch {
    res.redirect('/api/quran');
  }
}

module.exports = {
  quran_get,
  surah_get
}
