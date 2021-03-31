const { resolve } = require('path')
require('dotenv').config()

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './resources/js',
  output: {
    path: resolve(__dirname, 'public'),
    filename: 'main.js',
  },
}
