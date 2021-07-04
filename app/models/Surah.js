'use strict'

exports.find = () => require('../../data/surahs.json')

/**
 * Formats the ayah according to the language provided
 *
 * @param {{ [prop: 'num' | 'ara' | 'eng' | 'ban']: String }} param0
 * @param {{ [prop: 'ara' | 'eng' | 'ban']: Boolean }} show
 */
const formatAyah = ({ num, ara, 'eng:sai': ens, 'eng:arb': ena, ban }, show) => ({
  num,
  ara: show.ara ? ara : undefined,
  'eng:sai': show['eng:sai'] ? ens : undefined,
  'eng:arb': show['eng:arb'] ? ena : undefined,
  ban: show.ban ? ban : undefined,
})

/**
 * Returns the surah info and its ayahs
 *
 * @param {String} id
 * @param {{ [prop: 'ara' | 'eng' | 'ban']: Boolean }} show
 */
exports.findById = (id, show) => {
  try {
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
    return { info, surah }
  } catch (err) {
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
  const ayahs = []
  for (let i = 1; i <= 114; i++) {
    const { info, surah } = this.findById(i, { ara: true, 'eng:sai': true, ban: true })
    surah.forEach((ayah) => {
      if (ayah[l === 'eng' ? 'eng:sai' : l].includes(term)) ayahs.push({ info, ...formatAyah(ayah, show) })
    })
  }
  return ayahs
}
