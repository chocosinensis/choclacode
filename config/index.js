const { static, urlencoded, json } = require('express');
const { connect } = require('mongoose');
const cookie = require('cookie-parser');

const {
  username, password,
  url, database
} = require('./keys.json').mongodb;
const { discuss } = require('../helpers/socket');

const listen = (app) => {
  connect(
    `mongodb+srv://${username}:${password}@${url}/${database}`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  );
  const server = app.listen(process.env.PORT || 3000);

  const io = require('socket.io')(server);
  discuss(io);
}

const config = (app) => {
  // settings
  app.set('view engine', 'ejs');
  app.set('json spaces', 2);

  // middlewares
  app.use(static('public'));
  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.use(cookie());
}

module.exports = { listen, config };
