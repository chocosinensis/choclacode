'use strict'

const { resolve } = require('path')
const express = require('express')
const cookie = require('cookie-parser')
const cors = require('cors')
const { connect } = require('mongoose')
const socketio = require('socket.io')

require('../app/helpers/functions').dotenv()
const rootRouter = require('../app/routes')
const { morgan } = require('../app/middlewares')
const { uri } = require('../app/helpers/constants')
const socket = require('../app/helpers/socket')
const { logger, error } = require('../app/helpers/logger')

const connectDatabase = async () => {
  console.log(uri())
  try {
    await connect(uri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log('Database Connected')
    logger.log(`Database Connected ~~> ~@[${process.env.DB_ATLAS == 'false' ? uri() : 'Atlas'}]`)
  } catch (err) {
    console.log('Database Connection Failed', err.stack.toString())
    error.log(err.stack.toString())
  }
}

/**
 * Connects to database, starts the server and configures socket.io
 * Every steps are skipped in test environment
 *
 * @param {import('express').Application} app
 */
const listen = (app) => {
  logger.log('Application Started')

  const { PORT, NODE_ENV } = process.env

  if (NODE_ENV === 'test') return app

  connectDatabase()

  const server = app.listen(PORT)
  socket(socketio(server))
  logger.log(`Application Listening ==> ~@[http://localhost:${PORT}]`)

  return app
}

/**
 * Configures the application
 *
 * @param {import('express').Application} app
 */
module.exports = (app) =>
  listen(app)
    // settings
    .set('env', process.env.NODE_ENV)
    .set('views', resolve(__dirname, '../app/views'))
    .set('view engine', 'pug')
    .set('json spaces', 2)
    .disable('x-powered-by')

    // middlewares
    .use('/public', cors(), express.static(resolve(__dirname, '../public')))
    .use(express.urlencoded({ extended: true }), express.json(), cookie(process.env.COOKIE_SECRET), morgan, rootRouter)
