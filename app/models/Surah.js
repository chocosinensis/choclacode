'use strict'

const { error } = require('../helpers/logger')

exports.find = () => require('../../data/surahs.json')

/**
 * Formats the ayah according to the language provided
 *
 * @param {{ [prop: 'num' | 'ara' | 'eng' | 'ban']: String }} param0
 * @param {{ [prop: 'ara' | 'eng' | 'ban']: Boolean }} show
 */
const formatAyah = ({ num, ara, 'eng:sai': ens, 'eng:arb': ena, ban, sajdah }, show) => ({
  num,
  ara: show.ara ? `${ara}${sajdah && ' ۩'}` : undefined,
  'eng:sai': show['eng:sai'] ? `${ens}${sajdah && ' ۩'}` : undefined,
  'eng:arb': show['eng:arb'] ? `${ena}${sajdah && ' ۩'}` : undefined,
  ban: show.ban ? `${ban}${sajdah && ' ۩'}` : undefined,
})

/**
 * Returns the surah info and its ayahs
 *
 * @param {String} id
 * @param {{ [prop: 'ara' | 'eng' | 'ban']: Boolean }} show
 * @param {String} range
 */
exports.findById = (id, show, range = '') => {
  try {
    const [start, end] = range.split(/\s*[,_\.\-]\s*/g).map((r) => (r ? parseInt(r) : null))
    // prettier-ignore
    const surahinfo = this.find().flat().find(({ num }) => num == id)
    const info = {
      ...surahinfo,
      translations: {
        'eng:sai': 'English » Saheeh International',
        'eng:arb': 'English » Arberry',
        ban: 'Bengali » Zohurul Hoque',
      },
      bismillah: !['', '1', '9'].includes(surahinfo.num),
    }
    const surah = require(`../../data/quran/${id}.json`).map((ayah) => formatAyah(ayah, show))
    return {
      info,
      surah: surah.filter((ayah) => (start || 1) <= ayah.num && ayah.num <= (end || start || surah.length)),
    }
  } catch (err) {
    error.log(err)
    throw err
  }
}

/**
 * Searches the whole Quran and returns the found ayahs
 *
 * @param {String} term
 * @param {'ara' | 'eng' | 'ban'} l
 * @param {{ [prop: 'ara' | 'eng' | 'ban']: Boolean }} show
 */
exports.search = (term, l, show) => {
  if (term.trim() == '') return []
  const ayahs = []
  for (let i = 1; i <= 114; i++) {
    const { info, surah } = this.findById(i, { ara: true, 'eng:sai': true, 'eng:arb': true, ban: true })
    surah.forEach((ayah) => {
      if (ayah[l === 'eng' ? 'eng:sai' : l].toLowerCase().includes(term.toLowerCase().trim()))
        ayahs.push({ info, ...formatAyah(ayah, show) })
    })
  }
  return ayahs
}
