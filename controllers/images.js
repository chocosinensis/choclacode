const { Types: { ObjectId } } = require('mongoose');

const { gfs } = require('../config/multer');
const { err404 } = require('.');

exports.images_post = (req, res) => {
  res.json({ image: `/images/${req.file.filename}` });
}

exports.image_get = (req, res) => {
  gfs()
  .find({ filename: req.params.image }).toArray((err, files) => {
    const file = files[0];
    const validTypes = [
      'image/jpeg', 'image/jpg',
      'image/png', 'image/gif'
    ];
    if (file && validTypes.includes(file.contentType)) {
      gfs().openDownloadStreamByName(req.params.image).pipe(res);
    } else {
      err404(req, res);
    }
  });
}

exports.image_delete = (req, res) => {
  const { id } = req.params;
  gfs().delete(new ObjectId(id), (err) => {
    if (err) {
      return res.status(404).json({ err });
    }

    res.json({ deleted: true });
  });
}
