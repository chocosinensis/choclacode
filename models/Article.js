const { Schema, model } = require('mongoose');

const { schemaType } = require('../resources/helpers/functions');

const articleSchema = new Schema({
  title: {
    ...schemaType(4, 124, [
      'Please enter a title',
      'Title must be at least 4 characters long',
      'Title can have a maximum of 124 characters'
    ]),
    validate: [
      (val) => /^[\w\d\s()\._!?\-]+$/g.test(val),
      'Title can only contain the following : A-Z a-z 0-9 . _ - ? !'
    ]
  },
  body: {
    type: String,
    required: [true, 'Please write something for your article'],
    minlength: [25, 'Body must be at least 25 characters long']
  },
  slug: {
    ...schemaType(4, 124, [
      'Please enter an article slug',
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
  createdAt: String,
  deleted: Boolean
});

articleSchema.pre('save', function (next) {
  this.deleted = false;
  next();
});

articleSchema.statics.edit = async function ({
  slug, id, username,
  title, body
}) {
  return await this.findOneAndUpdate({
    slug, 'author.id': id, 'author.name': username,
    deleted: false
  }, { $set: { title, body } }, { useFindAndModify: false });
}
articleSchema.statics.delete = async function (slug, id, username) {
  return this.findOneAndUpdate({
    slug, 'author.id': id, 'author.name': username,
    deleted: false
  }, { $set: {
    slug: `${slug} ${Math.random()}-dele-${Math.random()}-ted-${Math.random()}-_-`,
    deleted: true
  } }, { useFindAndModify: false });
}

const Article = model('article', articleSchema);

module.exports = Article;
