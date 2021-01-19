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
