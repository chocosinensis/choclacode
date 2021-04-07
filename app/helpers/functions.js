const { resolve } = require('path')
const { config } = require('dotenv')
const { sign } = require('jsonwebtoken')

const { maxAge } = require('./constants')

exports.dotenv = (env = '.env') =>
  config({ path: resolve(__dirname, `../../config/.env/${env}`) })

exports.schemaType = (min, max, [reqErr, minErr, maxErr]) => ({
  type: String,
  required: [true, reqErr],
  minlength: [min, minErr],
  maxlength: [max, maxErr],
})

exports.handleErrors = (err) => {
  let errors = {
    auth: {
      username: '',
      email: '',
      password: '',
      newPass: '',
    },
    article: {
      title: '',
      body: '',
      slug: '',
    },
  }

  if (err.message == 'Incorrect username')
    errors.auth.username = 'Your entered username is not registered'
  if (err.message == 'Incorrect email')
    errors.auth.email = 'Incorrect email entered'
  if (err.message == 'Incorrect password')
    errors.auth.password = 'Incorrect password entered'
  if (err.message == 'Short password')
    errors.auth.newPass = 'Password must have at least 6 characters'

  if (err.code == 11000) {
    if (err.message.includes('username'))
      errors.auth.username = 'Your entered username has already been registered'
    if (err.message.includes('email'))
      errors.auth.email = 'Your entered email has already been registered'
    if (err.message.includes('slug'))
      errors.article.slug =
        'Please use a different slug, because this has already been used'

    return errors
  }

  const updateErrors = (...fields) => {
    for (const field of fields)
      if (
        err.message.includes(
          `${field == 'auth' ? 'user' : field} validation failed`
        )
      )
        Object.values(err.errors).forEach(
          ({ properties }) =>
            (errors[field][properties.path] = properties.message)
        )
  }
  updateErrors('auth', 'article')

  return errors
}

exports.removify = (str) =>
  `${str} ${Math.random()}-dele-${Math.random()}-ted-${Math.random()}-_-`

exports.createToken = (id) =>
  sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge })

exports.toDate = (date) =>
  `${date.toDateString().substr(4)} ${date.toTimeString().substring(0, 8)}`
