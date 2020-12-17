const { Router } = require('express');

const { 
  signup_get, signup_post, 
  login_get, login_post, 
  logout_get,
  account_get, account_delete
} = require('../controllers/auth');
const { requireAuth } = require('../middlewares/auth');

const auth = Router();

auth.get('/signup', signup_get);
auth.post('/signup', signup_post);

auth.get('/login', login_get);
auth.post('/login', login_post);

auth.get('/logout', logout_get);

auth.get('/account', requireAuth, account_get);
auth.delete('/account', requireAuth, account_delete);

module.exports = auth;
