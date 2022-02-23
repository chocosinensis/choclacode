'use strict'

const Grid = require('../models/Grid')
const { logger } = require('../helpers/logger')

/**
 * @route POST /images
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.images_post = (req, res) => {
  logger.log(`New image created: ~@[/images/${req.file.filename}]`)
  res.json({ image: `/images/${req.file.filename}` })
}

/**
 * @route GET /images/:image
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.image_get = async (req, res, next) => {
  const file = await Grid.findOne({ filename: req.params.image })
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

  if (file && validTypes.includes(file.contentType)) return Grid.streamByName(req.params.image).pipe(res)

  next()
}

/**
 * @route DELETE /images/:id
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.image_delete = async (req, res) => {
  const { id } = req.params
  const { err } = await Grid.delete(id)
  if (err) {
    return res.status(404).json({ err })
  }
  res.json({ deleted: true })
}
