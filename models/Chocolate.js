exports.find = () => require('../data/chocolate/index.json');

exports.findById = (id) => {
  const choc = require('../data/chocolate/content.json');
  if (choc[id])
    return choc[id];

  throw new Error();
}
