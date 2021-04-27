'use strict'

const { Router } = require('express')

const {
  account_get,
  password_edit,
  profileimage_edit,
  account_delete,
} = require('../../controllers/auth')

const account = Router()

account
  .get('/', account_get)
  .put('/', password_edit)
  .put('/image', profileimage_edit)
  .delete('/', account_delete)

module.exports = account
