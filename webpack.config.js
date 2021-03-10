const { resolve } = require('path');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './resources/js',
  output: {
    path: resolve(__dirname, 'public', 'js'),
    filename: 'main.js'
  }
};
