const { connect } = require('mongoose')

const { uri } = require('../resources/helpers/constants')

module.exports = async () => {
  try {
    await connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
  } catch {}
}
