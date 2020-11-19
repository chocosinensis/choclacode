const { verify } = require('jsonwebtoken');

const User = require('../models/User');
const { code } = require('../config/keys').jwt;

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    verify(token, code, (err, decodedToken) => {
      if (err) res.redirect('/auth/login');
      else next();
    });
  } else res.redirect('/auth/login');
}

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    verify(token, code, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      }
      else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
}

module.exports = { requireAuth, checkUser };
