const Grid = require('../models/Grid')
const { err404 } = require('../resources/middlewares/error')

exports.images_post = (req, res) => {
  res.json({ image: `/images/${req.file.filename}` })
}

exports.image_get = async (req, res) => {
  const file = await Grid.findOne({ filename: req.params.image })
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

  if (file && validTypes.includes(file.contentType))
    return Grid.streamByName(req.params.image).pipe(res)

  err404(req, res)
}

exports.image_delete = async (req, res) => {
  const { id } = req.params
  const { err } = await Grid.delete(id)
  if (err) {
    return res.status(404).json({ err })
  }
  res.json({ deleted: true })
  // gfs().delete(new ObjectId(id), (err) => {
  //   if (err) {
  //     return res.status(404).json({ err });
  //   }

  //   res.json({ deleted: true });
  // });
}
