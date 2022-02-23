'use strict'

const { discuss } = require('./discuss')

module.exports = (io) => {
  discuss(io)
}
