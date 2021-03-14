const {
  DB_USERNAME, DB_PASSWORD,
  DB_URL, DB_DATABASE
} = process.env;

exports.uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_URL}/${DB_DATABASE}`;

exports.maxAge = 3 * 24 * 60 * 60;
