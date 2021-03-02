const { verify } = require('jsonwebtoken');

const User = require('../../models/User');

const { JWT_SECRET } = process.env;

const requireAuth = (req, res, next) => {
  const redirect = `/auth/login?next=${req.originalUrl}`;
  const token = req.cookies.jwt;
  if (token) {
    verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) res.redirect(redirect);
      else next();
    });
  } else res.redirect(redirect);
}

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    verify(token, JWT_SECRET, async (err, decodedToken) => {
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

const requireGuest = (req, res, next) => {
  res.locals.user ?
    res.redirect('/dashboard') :
    next();
}

module.exports = { requireAuth, checkUser, requireGuest };
