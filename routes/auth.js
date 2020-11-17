const { Router } = require('express');

const { 
  signup_get, signup_post, 
  login_get, login_post, 
  account_get,
  logout_get
} = require('../controllers/auth');
const { requireAuth } = require('../middlewares/auth');

const router = Router();

router.get('/signup', signup_get);
router.post('/signup', signup_post);

router.get('/login', login_get);
router.post('/login', login_post);

router.get('/account', requireAuth, account_get)

router.get('/logout', logout_get);

module.exports = router;
