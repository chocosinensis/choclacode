const { resolve } = require('path');

module.exports = {
  mode: 'production',
  entry: './resources/js',
  output: {
    path: resolve(__dirname, 'public', 'js'),
    filename: 'main.js'
  }
};
