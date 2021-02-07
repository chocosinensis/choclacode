const { Router } = require('express');

const { 
  signup_get, signup_post, 
  login_get, login_post, 
  logout_get,
  account_get, account_edit, account_delete
} = require('../controllers/auth');
const {
  requireAuth, checkUser, requireGuest
} = require('../resources/middlewares/auth');

const auth = Router();

auth
  .get('/signup', requireGuest, signup_get)
  .post('/signup', requireGuest, signup_post)

  .get('/login', requireGuest, login_get)
  .post('/login', requireGuest, login_post)

  .get('/logout', requireAuth, logout_get)

  .get('/account', requireAuth, account_get)
  .put('/account', requireAuth, checkUser, account_edit)
  .delete('/account', requireAuth, checkUser, account_delete);

module.exports = auth;
