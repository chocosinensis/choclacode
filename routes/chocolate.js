const { Router } = require('express')

const {
  chocolate_get,
  chocolatedetail_get,
} = require('../controllers/chocolate')

const chocolate = Router()

chocolate.get('/', chocolate_get).get('/:slug', chocolatedetail_get)

module.exports = chocolate
