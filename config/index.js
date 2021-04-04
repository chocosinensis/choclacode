const { resolve } = require('path')
const { static, urlencoded, json } = require('express')
const cookie = require('cookie-parser')
const cors = require('cors')
const socketio = require('socket.io')
require('dotenv').config()

const connect = require('./connect')
const rootRouter = require('../app/routes')
const socket = require('../app/helpers/socket')

exports.listen = (app) => {
  connect()

  const server = app.listen(process.env.PORT)
  socket(socketio(server))

  return app
}

exports.config = (app) =>
  app
    // settings
    .set('views', resolve(__dirname, '../app/views'))
    .set('view engine', 'pug')
    .set('json spaces', 2)

    // middlewares
    .use('/public', cors(), static(resolve(__dirname, '../public')))
    .use(urlencoded({ extended: true }), json(), cookie(), rootRouter)
