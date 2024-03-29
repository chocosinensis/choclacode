'use strict'

const { Schema, model } = require('mongoose')
const { genSalt, hash, compare } = require('bcryptjs')

const { schemaType, removify } = require('../helpers/functions')

const userSchema = new Schema({
  username: {
    ...schemaType(4, 32, [
      'Please enter a username',
      'Usernames must have at least 4 characters',
      'Usernames can have a maximum of 32 characters',
    ]),
    unique: true,
    lowercase: [true, 'Username must be lowercase'],
    validate: [
      (val) => /^[a-z\d_\-]+$/g.test(val),
      'Username can only be alphanumberic, contain hyphens (-) and underscores (_) and cannot contain whitespaces',
    ],
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    validate: [(val) => /^\w+([\.-]?\w)*@\w+(\.[a-z]{2,8}){1,2}$/g.test(val), 'Please enter a valid email address'],
  },
  password: schemaType(6, 255, [
    'Please enter a password',
    'Password must have at least 6 characters',
    'Password can have a maximum of 255 characters',
  ]),
  profileImg: {
    type: String,
    default: '/public/assets/img/profile.png',
  },
  deleted: {
    type: Boolean,
    default: false,
  },
})

/** Hashes the password */
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await genSalt()
    this.password = await hash(this.password, salt)
  }

  next()
})

/**
 * Logs in a user with the given credentials
 *
 * @param {String} username
 * @param {String} password
 */
userSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username, deleted: false })
  if (user) {
    const auth = await compare(password, user.password)
    if (auth) return user
    throw new Error('Incorrect password')
  }
  throw new Error('Incorrect username')
}

/** Changes the password of a user */
userSchema.statics.changePassword = async function ({ email, password }) {
  const user = await this.findOne({ email, deleted: false })
  if (user) {
    const auth = await compare(password.current, user.password)
    if (auth) {
      if (password.newPass.length < 6) throw new Error('Short password')
      user.password = password.newPass
      await user.save()
      return user
    }
    throw new Error('Incorrect password')
  }
}

/**
 * Updates the profile image of a user
 *
 * @param {String} id
 * @param {String} image
 */
userSchema.statics.editProfileImage = async function (id, image) {
  const user = await this.findById(id)
  user.profileImg = image
  await user.save()
  return user
}

/**
 * Marks a user for deletion
 *
 * @param {String} _id
 * @param {String} email
 * @param {String} password
 */
userSchema.statics.delete = async function (_id, email, password) {
  if (!_id || !email || !password) throw new Error('Incorrect username')

  const user = await this.findOne({ email, deleted: false })
  if (user && user._id == _id) {
    const auth = await compare(password, user.password)
    if (auth)
      return this.findOneAndUpdate(
        { _id, email, deleted: false },
        {
          $set: {
            username: removify(user.username),
            email: removify(user.email),
            deleted: true,
          },
        },
        { useFindAndModify: false }
      )

    throw new Error('Incorrect password')
  }
}

const User = model('user', userSchema)

module.exports = User
