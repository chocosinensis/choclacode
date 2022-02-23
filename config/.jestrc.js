'use strict'

const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '../tests'),
  testEnvironment: 'node',
  verbose: true,
}
