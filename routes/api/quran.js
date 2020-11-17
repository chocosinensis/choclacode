const { Router } = require('express');

const {
  quran_get,
  surah_get
} = require('../../controllers/api/quran');

const quran = Router();

quran.get('/', quran_get);

quran.get('/:surah', surah_get);

module.exports = quran;
