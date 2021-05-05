'use strict'

const {
  mongo,
  connection,
  Types: { ObjectId },
} = require('mongoose')

/**
 * The GridFSBucket instance
 */
exports.gfs = () => new mongo.GridFSBucket(connection.db, { bucketName: 'uploads' })

/**
 * Retreaves a single gridfs document
 */
exports.findOne = (params) =>
  new Promise((resolve, reject) => {
    this.gfs()
      .find(params)
      .toArray((err, files) => {
        if (err) return reject(err)

        if (files && files[0]) return resolve(files[0])

        resolve(null)
      })
  })

/**
 * Deletes a gridfs document
 *
 * @param {String} id
 */
exports.delete = (id) =>
  new Promise((resolve, reject) => {
    this.gfs().delete(new ObjectId(id), (err, result) => {
      if (err) return reject({ err })

      resolve({ result })
    })
  })

/**
 * Opens the download stream
 *
 * @param {String} filename
 */
exports.streamByName = (filename) => this.gfs().openDownloadStreamByName(filename)
