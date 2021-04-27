'use strict'

const { resolve } = require('path')
require('../app/helpers/functions').dotenv()

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './app/resources/js',
  output: {
    path: resolve(__dirname, '../public'),
    filename: 'main.js',
  },
}
