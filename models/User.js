const { Schema, model } = require('mongoose');
const { genSalt, hash, compare } = require('bcrypt');

const { schemaType } = require('../helpers/functions');

const userSchema = new Schema({
  username: { 
    ...schemaType(4, 32, [
      'Please enter a username',
      'Usernames must have at least 4 characters',
      'Usernames can have a maximum of 32 characters'
    ]), 
    unique: true, lowercase: [true, 'Username must be lowercase'],
    validate: [
      (val) => /^[a-z\d_\-]+$/g.test(val),
      'Username can only be alphanumberic, contain hyphens (-) and underscores (_) and cannot contain whitespaces'
    ]
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    validate: [
      (val) => /^\w+([\.-]?\w)*@\w+(\.[a-z]{2,8}){1,2}$/g.test(val),
      'Please enter a valid email address'
    ]
  },
  password: schemaType(6, 255, [
    'Please enter a password',
    'Passwords must have at least 6 characters',
    'Passwords can have a maximum of 255 characters'
  ])
});

userSchema.pre('save', async function (next) {
  const salt = await genSalt();
  this.password = await hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username });
  if (user) {
    const auth = await compare(password, user.password);
    if (auth) return user;
    throw Error('Incorrect password');
  }
  throw Error('Incorrect username');
}
userSchema.statics.delete = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await compare(password, user.password);
    if (auth) return user.remove();
    throw Error('Incorrect password');
  }
}

const User = model('user', userSchema);

module.exports = User;
