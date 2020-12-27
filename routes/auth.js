const { Router } = require('express');

const { 
  signup_get, signup_post, 
  login_get, login_post, 
  logout_get,
  account_get, account_delete
} = require('../controllers/auth');
const { requireAuth, requireGuest } = require('../middlewares/auth');

const auth = Router();

auth.get('/signup', requireGuest, signup_get);
auth.post('/signup', requireGuest, signup_post);

auth.get('/login', requireGuest, login_get);
auth.post('/login', requireGuest, login_post);

auth.get('/logout', requireAuth, logout_get);

auth.get('/account', requireAuth, account_get);
auth.delete('/account', requireAuth, account_delete);

module.exports = auth;
