(async () => {
  const quotes = await (await fetch('/api/quotes')).json();
  const quoteElem = $('.quote');

  const renderquote = ({
    quote, src: { surah, ayah }
  }) => quoteElem.innerHTML = `<div class="content">
    <q>${quote}</q>
    <a href="/quran/${surah}#${ayah}" target="_blank">
      (${surah} : ${ayah})
    </a>
  </div>`;
  renderquote(quotes[0]);

  let i = 0;
  setInterval(() => {
    i = i == quotes.length - 1 ? 0 : i + 1;
    renderquote(quotes[i]);
  }, 7000);
})();
(() => {
  const [main, themes, icons] = [
    $('main'),
    $$('#themes a'),
    $$('#themes a i')
  ];
  const updateIcons = () => {
    icons.forEach((i) => i.textContent =
      main.classList.contains(i.parentElement.dataset.theme)
      ? 'done' : 'disabled_by_default');
  }
  updateIcons();
  themes.forEach((a) =>
    a.addEventListener('click', () => {
      localStorage.setItem('theme', a.dataset.theme);
      main.className = localStorage.getItem('theme');
      updateIcons();
    }));
})();
