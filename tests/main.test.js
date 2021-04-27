'use strict'

const { connection } = require('mongoose')

const app = require('../app')
const db = require('./database')

beforeAll(async () => {
  require('../app/helpers/functions').dotenv('.env.test')
  await db.connect()
})
afterAll(async () => await db.close())

beforeEach(async () => await db.clear())

describe('config', () => {
  it('should use .env.test file', () => {
    expect(process.env.NODE_ENV).not.toBe('development')
    expect(process.env.NODE_ENV).toBe('test')
    expect(app.get('env')).toBe('test')
  })

  it('should use the test database', () => {
    const dbname = connection.db.databaseName
    expect(dbname).not.toBe('base-choco')
    expect(dbname).not.toBe('test-choco')
  })
})
