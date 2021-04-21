exports.uri = (
  {
    DB_USERNAME,
    DB_PASSWORD,
    DB_URL,
    DB_DATABASE,
    DB_ATLAS,
    DB_URI,
  } = process.env
) =>
  DB_ATLAS != 'false'
    ? `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_URL}/${DB_DATABASE}`
    : DB_URI

exports.maxAge = 3 * 24 * 60 * 60
