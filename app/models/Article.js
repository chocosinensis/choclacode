'use strict'

const { Schema, model } = require('mongoose')

const { schemaType, removify, toDate } = require('../helpers/functions')

const userSchema = new Schema({
  id: String,
  name: String,
})

const dateSchema = {
  type: String,
  default: toDate(new Date()),
}

const articleSchema = new Schema({
  title: {
    ...schemaType(4, 124, [
      'Please enter a title',
      'Title must be at least 4 characters long',
      'Title can have a maximum of 124 characters',
    ]),
    validate: [
      (val) => /^[\w\d\s():'"\._!?\u0980-\u09ff\-]+$/gu.test(val),
      'Title can only contain the following : A-Z a-z 0-9 \' " . _ - ? !',
    ],
  },
  body: {
    type: String,
    required: [true, 'Please write something for your article'],
    minlength: [25, 'Body must be at least 25 characters long'],
  },
  slug: {
    ...schemaType(4, 124, [
      'Please enter an article slug',
      'Slug must be at least 4 characters long',
      'Slug can have a maximum of 124 characters',
    ]),
    unique: true,
    validate: [
      (val) => /^[a-z\u0980-\u09ff0-9_\-]+$/gu.test(val),
      'Slugs can contain only lowercase letters, numbers, hyphens (-) and underscores (_)',
    ],
  },
  author: userSchema,
  createdAt: dateSchema,
  likes: {
    type: [
      {
        likedBy: userSchema,
        likedAt: dateSchema,
      },
    ],
    default: [],
  },
  deleted: {
    type: Boolean,
    default: false,
  },
})

/** Edits an article */
articleSchema.statics.edit = async function ({ slug, id, username, title, body }) {
  const article = await this.findOne({
    slug,
    'author.id': id,
    'author.name': username,
    deleted: false,
  })
  article.title = title
  article.body = body
  article.slug = slug

  await article.save()
  return article
}

/**
 * Marks an article for deletion
 *
 * @param {String} slug
 * @param {String} id
 * @param {String} username
 */
articleSchema.statics.delete = async function (slug, id, username) {
  return this.findOneAndUpdate(
    {
      slug,
      'author.id': id,
      'author.name': username,
      deleted: false,
    },
    {
      $set: {
        slug: removify(slug),
        deleted: true,
      },
    },
    { useFindAndModify: false }
  )
}

/**
 * Likes or unlikes an article
 *
 * @param {String} slug
 * @param {String} id
 * @param {String} name
 */
articleSchema.statics.like = async function (slug, id, name) {
  const article = await this.findOne({ slug, deleted: false })
  let status
  if (article.likes.find(({ likedBy }) => likedBy.id === id)) {
    article.likes = article.likes.filter(({ likedBy }) => likedBy.id !== id)
    status = 200
  } else {
    article.likes.push({ likedBy: { id, name } })
    status = 201
  }
  await article.save()
  return { likes: article.likes, status }
}

const Article = model('article', articleSchema)

module.exports = Article
