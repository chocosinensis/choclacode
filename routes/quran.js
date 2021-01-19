const { Router } = require('express');

const { quran_get, surah_get } = require('../controllers/quran');

const quran = Router();

quran
  .get('/', quran_get)
  .get('/:surah', surah_get);

module.exports = quran;
