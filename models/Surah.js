exports.find = () => require('../data/quran/surahs.json');

exports.findById = (id) => {
  try {
    const info = exports.find().flat().find(({ num }) => num == id);
    const surah = require(`../data/quran/${id}.json`);
    return { info, surah };
  } catch (err) {
    throw err;
  }
}
