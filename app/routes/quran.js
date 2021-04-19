const { Router } = require('express')

const { quran_get, surah_get } = require('../controllers/quran')
const { showLangs } = require('../middlewares/quran')
const { error } = require('../middlewares/error')

const quran = Router()

quran
  .get('/', quran_get)
  .get('/:surah', showLangs, surah_get, error(404, 'Not Found'))

module.exports = quran
