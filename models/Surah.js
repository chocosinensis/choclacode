exports.find = () => require('../data/quran/surahs.json');

exports.findById = (id) => {
  try {
    const surah = require(`../data/quran/${id}.json`);
    return surah;
  } catch (err) {
    throw err;
  }
}
