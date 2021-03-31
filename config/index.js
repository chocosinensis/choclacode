const { static, urlencoded, json } = require('express')
const cookie = require('cookie-parser')
const cors = require('cors')
const socketio = require('socket.io')
require('dotenv').config()

const connect = require('./connect')
const rootRouter = require('../routes')
const socket = require('../resources/helpers/socket')

const listen = (app) => {
  connect()

  const server = app.listen(process.env.PORT)
  socket(socketio(server))

  return app
}

module.exports = (app) => {
  listen(app)
    // settings
    .set('view engine', 'pug')
    .set('json spaces', 2)

    // middlewares
    .use('/public', cors(), static('public'))
    .use(urlencoded({ extended: true }), json(), cookie(), rootRouter)
}
