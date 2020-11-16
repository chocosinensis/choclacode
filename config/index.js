const { static, urlencoded, json } = require('express');
const { connect } = require('mongoose');
const cookie = require('cookie-parser');

const listen = async (app) => {
  await connect(
    'mongodb+srv://saqib:09jHOCFX4O17Z02ZAji1hd23@choco.gduh2.mongodb.net/base-choco',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  );
  const server = app.listen(process.env.PORT || 3000);
  
  const io = require('socket.io')(server);
  io.on('connection', (socket) => socket.on('new-msg', (data) => socket.broadcast.emit('sendmsg', data)));
}

const config = (app) => {
  app.set('view engine', 'ejs');
  app.use(static('public'));
  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.use(cookie());
}

module.exports = { listen, config };
