const find = () => require('../data/quran/surahs.json');

const findById = (id) => {
  try {
    const surah = require(`../data/quran/${id}.json`);
    return surah;
  } catch (err) {
    throw err;
  }
}

module.exports = { find, findById };
