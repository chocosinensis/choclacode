const { Router } = require('express');

const {
  account_get, account_edit, account_delete
} = require('../../controllers/auth');

const account = Router();

account
  .get('/', account_get)
  .put('/', account_edit)
  .delete('/', account_delete);

module.exports = account;
