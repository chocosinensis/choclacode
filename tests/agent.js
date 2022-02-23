'use strict'

const request = require('supertest')

const app = require('../app')

module.exports = request.agent(app)
