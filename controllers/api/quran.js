const Surah = require('../../models/Surah');

const quran_get = (req, res) => {
  const surahs = Surah.find();

  const { raw } = req.query;
  if (raw && raw == 'false')
    return res.render('api/details', {
      title: `API &laquo; Quran`, json: JSON.stringify(surahs, null, 2)
    });

  res.json(surahs);
}

const surah_get = (req, res) => {
  const { surah } = req.params;

  try {
    const surahjson = Surah.findById(surah);

    const { raw } = req.query;
    if (raw && raw == 'false')
      return res.render('api/details', {
        title: `API &laquo; Surah`,
        json: JSON.stringify(surahjson, null, 2)
      });

    res.json(surahjson);
  } catch {
    res.redirect('/api/quran');
  }
}

module.exports = { quran_get, surah_get };
