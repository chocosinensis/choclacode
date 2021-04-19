exports.error = (status, detail) => (req, res) =>
  res.status(status).render('others/error', { status, detail })

exports.errorHandler = (err, req, res) => {
  if (err) {
    res.status(500).render('others/error', {
      title: '500 &laquo; Internal Server Error',
      status: 500,
      detail: 'Internal Server Error',
    })
  }
}
