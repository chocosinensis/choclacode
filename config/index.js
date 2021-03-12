const { static, urlencoded, json } = require('express');
const { connect } = require('mongoose');
const cookie = require('cookie-parser');
const socketio = require('socket.io');
require('dotenv').config();

const rootRouter = require('../routes');
const socket = require('../resources/helpers/socket');

const {
  PORT,
  DB_USERNAME, DB_PASSWORD,
  DB_URL, DB_DATABASE
} = process.env;

const listen = (app) => {
  connect(
    `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_URL}/${DB_DATABASE}`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  ).catch();
  const server = app.listen(PORT);

  socket(socketio(server));
}

const config = (app) => {
  app
    // settings
    .set('view engine', 'pug')
    .set('json spaces', 2)

    // middlewares
    .use(
      static('public'),
      urlencoded({ extended: true }),
      json(),
      cookie(),
      rootRouter
    );
}

module.exports = { listen, config };
