const { static, urlencoded, json } = require('express');
const { connect } = require('mongoose');
const cookie = require('cookie-parser');
const cors = require('cors');

const { password } = require('./keys.json').mongodb;
const { socket } = require('./functions');

const listen = async (app) => {
  await connect(
    `mongodb+srv://saqib:${password}@choco.gduh2.mongodb.net/base-choco`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  );
  const server = app.listen(process.env.PORT || 3000);

  const io = require('socket.io')(server);
  socket(io);
}

const config = (app) => {
  app.set('view engine', 'ejs');
  app.use(static('public'));
  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.use(cookie());
  app.use(cors());
}

module.exports = { listen, config };
