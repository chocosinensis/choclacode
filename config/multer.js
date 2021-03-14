const { extname } = require('path');
const crypto = require('crypto');
const { mongo, connection } = require('mongoose');
const multer = require('multer');
const GridFSStorage = require('multer-gridfs-storage');

const { uri } = require('../resources/helpers/constants');

exports.gfs = () => new mongo.GridFSBucket(connection.db, { bucketName: 'uploads' });

exports.upload = multer({
  storage: new GridFSStorage({
    url: uri,
    file: (req, file) => new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + extname(file.originalname);
        resolve({
          filename,
          bucketName: 'uploads'
        });
      });
    })
  }),
  limits: { fileSize: 1_000_000 },
  fileFilter(req, file, callback) {
    const filetypes = /jpeg|jpg|png|gif/;
    if (
      filetypes.test(extname(file.originalname).toLowerCase()) &&
      filetypes.test(file.mimetype)
    ) {
      return callback(null, true);
    }

    callback(new Error('Only jpeg, jpg, png and gif extensions are allowed'));
  }
});
