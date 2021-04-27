'use strict'

exports.find = () => require('../../data/surahs.json')

/**
 * Returns the surah info and its ayahs
 *
 * @param {String} id
 */
exports.findById = (id) => {
  try {
    const info = exports
      .find()
      .flat()
      .find(({ num }) => num == id)
    const surah = require(`../../data/quran/${id}.json`)
    return { info, surah }
  } catch (err) {
    throw err
  }
}
