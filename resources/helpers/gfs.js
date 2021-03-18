const { mongo, connection } = require('mongoose');

exports.gfs = () => new mongo.GridFSBucket(connection.db, { bucketName: 'uploads' });
