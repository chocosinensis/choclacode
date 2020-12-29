const find = () => require('../data/chocolate/index.json');

const findById = (id) => {
  const choc = require('../data/chocolate/content.json');
  if (choc[id])
    return choc[id];

  throw new Error();
}

module.exports = { find, findById };
