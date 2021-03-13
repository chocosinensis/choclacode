const User = require('../models/User');
const { handleErrors, createToken } = require('../resources/helpers/functions');

exports.signup_get = (req, res) => res.render('auth/signup', { title: 'Sign Up' });
exports.signup_post = async (req, res) => {
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

exports.login_get = (req, res) => res.render('auth/login', { title: 'Login' });
exports.login_post = async (req, res) => {
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

exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}

exports.account_get = (req, res) =>
  res.render('auth/account', { title: `@${res.locals.user.username}` });
exports.account_edit = async (req, res) => {
  const { email } = res.locals.user;
  const { current, newPass } = req.body;
  try {
    const { user, err } = await User.changePassword({
      email, password: { current, newPass }
    });
    if (err)
      throw err;
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err).auth;
    res.status(400).json({ errors });
  }
}
exports.account_delete = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.delete(res.locals.user.id, email, password);
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err).auth;
    res.status(400).json({ errors });
  }
}
