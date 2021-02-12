const { Router } = require('express');

const { quran_get, surah_get } = require('../controllers/quran');
const { showLangs } = require('../resources/middlewares/quran');

const quran = Router();

quran
  .get('/', quran_get)
  .get('/:surah', showLangs, surah_get);

module.exports = quran;
