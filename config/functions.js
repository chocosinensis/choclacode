const { sign } = require('jsonwebtoken');

const { code } = require('./keys').jwt;

const schemaType = (min, max, errors) => ({
  type: String,
  required: [true, errors[0]],
  minlength: [min, errors[1]],
  maxlength: [max, errors[2]]
});
const handleErrors = (err) => {
  let errors = {
    auth: {
      username: '', email: '', password: ''
    },
    article: {
      title: '', body: '', slug: ''
    }
  };

  if (err.message == 'Incorrect username')
    errors.auth.username = 'That username is not registered';
  if (err.message == 'Incorrect password')
    errors.auth.password = 'Incorrect password entered';

  if (err.code == 11000) {
    errors.auth.username = 'That username is already registered';
    errors.article.slug = 'Please use a different slug, because this has already been used';
    return errors;
  }

  if (err.message.includes('user validation failed')) 
    Object.values(err.errors).forEach(({ properties }) => 
      errors.auth[properties.path] = properties.message);

  if (err.message.includes('article validation failed'))
    Object.values(err.errors).forEach(({ properties }) =>
      errors.article[properties.path] = properties.message);

  return errors;
}

const createToken = (id) => sign(
  { id }, code, { expiresIn: 3 * 24 * 60 * 60 }
);
const authget = (res, rendering, title) => {
  if (res.locals.user) res.redirect('/');
  res.render(rendering, { title });
}

const socket = (io) => {
  let users = [];
  io.on('connection', (socket) => {
    let _name;
    socket.emit('connection');
    socket.on('newuser', ({ name }) => {
      _name = name;
      users = users.includes(name) ? users : [...users, name];
      io.sockets.emit('users', users);
    });
    socket.on('newmsg', (data) => socket.broadcast.emit('sendmsg', data));
    socket.on('disconnect', () => {
      users = users.filter(user => user != _name);
      socket.broadcast.emit('users', users);
    });
  });
}
const jsonify = (object, indent=2) => {
  const ind = Array(indent).fill(' ').join('');
  const keys = Object.keys(object);
  let json = '{';
  for (let key in object) {
    const value = object[key];
    json += `\n${ind}"${key}": ${
      typeof value == 'string' ? `"${value}"` :
      typeof value == 'object' ? jsonify(value, indent + 2) :
      value
    }`;
    if (keys.lastIndexOf(key) != keys.length - 1)
      json += ',';
  }
  indent = Array(indent - 2).fill(' ').join('');
  return json + `\n${indent}}`;
}
const toDate = (date) => `${date.toDateString().substr(4)} ${date.toTimeString().substring(0, 8)}`;

module.exports = {
  schemaType, handleErrors, 
  createToken, authget, 
  socket, jsonify, toDate
};
