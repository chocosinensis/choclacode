window.addEventListener('load', async () => {
  const quotes = await (await fetch('/api/quotes')).json();
  const quoteElem = document.querySelector('.quote');

  const get = {
    link: ({ surah, ayah }) => `/quran/${surah}#${ayah}`,
    ayah: ({ surah, ayah }) => `(${surah} : ${ayah})`
  };
  const renderquote = ({ quote, src }) => quoteElem.innerHTML = `
    <div class="content">
      <q>${quote}</q>
      <a href="${get.link(src)}" target="_blank">${get.ayah(src)}</a>
    </div>
  `;

  renderquote(quotes[0]);

  let i = 0;
  setInterval(() => {
    i = i == quotes.length - 1 ? 0 : i + 1;
    renderquote(quotes[i]);
  }, 7000);
});
