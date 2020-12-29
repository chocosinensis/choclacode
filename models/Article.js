const { Schema, model } = require('mongoose');

const { schemaType } = require('../config/functions');

const articleSchema = new Schema({
  title: {
    ...schemaType(4, 124, [
      'Title is a required field',
      'Title must be at least 4 characters long',
      'Title can have a maximum of 124 characters'
    ]),
    validate: [
      (val) => /^[\w\d\s()\._!?\-]+$/g.test(val),
      'Title can only contain alphabets, numbers, hyphens (-), underscores (_) and brackets'
    ]
  },
  body: {
    type: String,
    required: [true, 'Body is a required field'],
    minlength: [25, 'Body must be at least 25 characters long']
  },
  slug: {
    ...schemaType(4, 124, [
      'Slug is a required field',
      'Slug must be at least 4 characters long',
      'Slug can have a maximum of 124 characters'
    ]),
    unique: true,
    validate: [
      (val) => /^[a-z0-9\_\-]+$/g.test(val), 
      'Slugs can contain only lowercase letters, numbers, hyphens (-) and underscores (_)'
    ]
  },
  author: {
    id: String,
    name: String
  },
  createdAt: String
});

const Article = model('article', articleSchema);

module.exports = Article;
