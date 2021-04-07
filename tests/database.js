const { connection, connect, disconnect } = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const mongoServer = new MongoMemoryServer()

exports.connect = async () => {
  await disconnect()

  const mongoUri = await mongoServer.getUri()

  try {
    await connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
  } catch {}
}

exports.close = async () => {
  await disconnect()
  await mongoServer.stop()
}

exports.clear = async () => {
  const collections = connection.collections

  for (const key in collections) {
    await collections[key].deleteMany()
  }
}
