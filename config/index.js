const { static, urlencoded, json } = require('express');
const { connect } = require('mongoose');
const cookie = require('cookie-parser');
require('dotenv').config();

const { discuss } = require('../resources/helpers/socket');

const {
  DB_USERNAME, DB_PASSWORD,
  DB_URL, DB_DATABASE
} = process.env;

const listen = (app) => {
  connect(
    `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_URL}/${DB_DATABASE}`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  );
  const server = app.listen(process.env.PORT ?? 3000);

  const io = require('socket.io')(server);
  discuss(io);
}

const config = (app) => {
  app
    // settings
    .set('view engine', 'ejs')
    .set('json spaces', 2)

    // middlewares
    .use(static('public'))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cookie());
}

module.exports = { listen, config };
