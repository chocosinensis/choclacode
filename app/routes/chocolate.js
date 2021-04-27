'use strict'

const { Router } = require('express')

const {
  chocolate_get,
  chocolatedetail_get,
} = require('../controllers/chocolate')
const { error } = require('../middlewares/error')

const chocolate = Router()

chocolate
  .get('/', chocolate_get)
  .get('/:slug', chocolatedetail_get, error(404, 'Not Found'))

module.exports = chocolate
