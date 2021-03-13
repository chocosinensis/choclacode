const { Router } = require('express');

const { login_get, login_post } = require('../../controllers/auth');

const login = Router();

login
  .get('/', login_get)
  .post('/', login_post);

module.exports = login;
