const removePadding = (el) => {
  el.parentElement.style.padding = '10px 0';
}
(() => {
  const quran = document.querySelector('.quran');
  if (quran)
    removePadding(quran);
})();
(() => {
  const surah = document.querySelector('.surah');
  if (surah)
    removePadding(surah);
})();
