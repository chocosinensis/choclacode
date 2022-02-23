'use strict'

const { Router } = require('express')

const { quran_get, search, surah_get } = require('../../controllers/api/quran')
const { showLangs } = require('../../middlewares/quran')

const quran = Router()

// prettier-ignore
quran
  .get('/', quran_get)
  .get('/search', showLangs, search)
  .get('/:surah', showLangs, surah_get)

module.exports = quran
