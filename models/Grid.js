const {
  mongo, connection,
  Types: { ObjectId }
} = require('mongoose');

exports.gfs = () => new mongo.GridFSBucket(connection.db, { bucketName: 'uploads' });

exports.findOne = (params) => new Promise((resolve, reject) => {
  this.gfs().find(params).toArray((err, files) => {
    if (err) return reject(err);

    if (files && files[0]) return resolve(files[0]);

    resolve(null);
  });
});

exports.delete = (id) => new Promise((resolve, reject) => {
  this.gfs().delete(new ObjectId(id), (err, result) => {
    if (err) return reject({ err });

    resolve({ result });
  });
});

exports.streamByName = (filename) =>
  this.gfs().openDownloadStreamByName(filename);
