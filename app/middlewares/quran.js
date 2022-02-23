'use strict'

/**
 * Determines whether to include a language or not
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.showLangs = (req, res, next) => {
  const show = { ara: false, 'eng:sai': false, 'eng:arb': false, ban: false }
  const { lang } = req.query

  if (lang) {
    for (const key in show) show[key] = lang.includes(key)
    if (Object.keys(show).every((k) => !show[k])) show.ara = show['eng:sai'] = show.ban = true
  } else show.ara = show['eng:sai'] = show.ban = true

  res.locals.show = show
  next()
}
