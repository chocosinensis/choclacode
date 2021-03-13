const { static, urlencoded, json } = require('express');
const cookie = require('cookie-parser');
const socketio = require('socket.io');
require('dotenv').config();

const connect = require('./connect');
const rootRouter = require('../routes');
const socket = require('../resources/helpers/socket');

const listen = (app) => {
  connect();
  const server = app.listen(process.env.PORT);

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
