const showLangs = (req, res, next) => {
  const show = { ara: false, eng: false, ban: false };
  const { lang } = req.query;

  if (lang) {
    if (lang.includes('ara'))
      show.ara = true;
    if (lang.includes('eng'))
      show.eng = true;
    if (lang.includes('ban'))
      show.ban = true;
  } else {
    show.ara = show.eng = show.ban = true;
  }

  res.locals.show = show;
  next();
}

module.exports = { showLangs };
