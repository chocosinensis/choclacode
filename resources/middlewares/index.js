const assignParams = (...params) => (req, res, next) => {
  for (const param of params)
    res.locals[param] = req.params[param];
  next();
}

module.exports = { assignParams };
