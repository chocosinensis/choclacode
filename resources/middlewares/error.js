exports.err403 = (req, res) =>
  res.status(403).render('others/error', {
    title: '403 &laquo; Forbidden',
    status: 403,
    detail: 'Forbidden',
  })

exports.err404 = (req, res) =>
  res.status(404).render('others/error', {
    title: '404 &laquo; Not Found',
    status: 404,
    detail: 'Not Found',
  })

exports.errorHandler = (err, req, res) => {
  if (err) {
    res.status(500).render('others/error', {
      title: '500 &laquo; Internal Server Error',
      status: 500,
      detail: 'Internal Server Error',
    })
  }
}
