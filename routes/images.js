const { Router } = require('express');

const { upload } = require('../config/multer');
const {
  images_post,
  image_get, image_delete
} = require('../controllers/images');
const { requireAuth } = require('../resources/middlewares/auth');

const images = Router();

images
  .post('/', requireAuth, upload.single('image'), images_post)

  .get('/:image', image_get)
  .delete('/:id', requireAuth, image_delete);

module.exports = images;
