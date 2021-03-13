const { connect } = require('mongoose');

const {
  DB_USERNAME, DB_PASSWORD,
  DB_URL, DB_DATABASE
} = process.env;

const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_URL}/${DB_DATABASE}`;

module.exports = async () => {
  try {
    await connect(uri, {
      useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
    });
  } catch {}
}
