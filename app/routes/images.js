const { Router } = require('express')

const {
  images_post,
  image_get,
  image_delete,
} = require('../controllers/images')
const { upload } = require('../middlewares/multer')
const { requireAuth } = require('../middlewares/auth')
const { error } = require('../middlewares/error')

const images = Router()

images
  .post('/', requireAuth, upload.single('image'), images_post)

  .get('/:image', image_get, error(404, 'Not Found'))
  .delete('/:id', requireAuth, image_delete)

module.exports = images
