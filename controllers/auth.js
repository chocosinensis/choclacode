const User = require('../models/User');
const { handleErrors, createToken, authget } = require('../config/functions');

const signup_get = (req, res) => authget(res, 'auth/signup', 'Sign Up');
const signup_post = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 1000 * 24 * 60 * 60 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err).auth;
    res.status(400).json({ errors });
  }
}

const login_get = (req, res) => authget(res, 'auth/login', 'Login');
const login_post = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 1000 * 24 * 60 * 60 });
    res.status(200).json({ user: user._id });
  } catch (err) { 
    const errors = handleErrors(err).auth;
    res.status(400).json({ errors });
  }
}

const account_get = (req, res) => 
  res.render('auth/account', { title: res.locals.user.username });

const logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}

module.exports = {
  signup_get, signup_post,
  login_get, login_post,
  account_get,
  logout_get
};
