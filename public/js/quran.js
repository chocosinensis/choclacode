const removePadding = (el) => {
  el.parentElement.style.padding = '10px 0';
}

(() => {
  const quran = $('.quran');
  if (quran)
    removePadding(quran);
})();
(() => {
  const surah = $('.surah');
  if (surah)
    removePadding(surah);
})();
