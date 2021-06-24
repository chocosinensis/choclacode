'use strict'

exports.find = () => require('../../data/surahs.json')

/**
 * Returns the surah info and its ayahs
 *
 * @param {String} id
 */
exports.findById = (id) => {
  try {
    // prettier-ignore
    const surahinfo = exports.find().flat().find(({ num }) => num == id)
    const info = {
      ...surahinfo,
      translations: { eng: 'English » Saheeh International', ban: 'Bengali » Mohiuddin Khan' },
      bismillah: !['', '1', '9'].includes(surahinfo.num),
    }
    const surah = require(`../../data/quran/${id}.json`)
    return { info, surah }
  } catch (err) {
    throw err
  }
}
