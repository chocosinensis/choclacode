'use strict'

const { Router } = require('express')

const { signup_get, signup_post } = require('../../controllers/auth')

const signup = Router()

signup.get('/', signup_get).post('/', signup_post)

module.exports = signup
