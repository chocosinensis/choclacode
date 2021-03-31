import { $, $$ } from '../utils'

export class Home {
  constructor() {
    this.init()

    this.quote()
    this.theme()
  }

  init() {
    this.quoteElem = $('.quote')

    this.main = $('main')
    this.themes = $$('#themes a')
    this.icons = $$('#themes a i')
  }

  renderquote({ quote, src: { surah, ayah } }) {
    this.quoteElem.innerHTML = `<div class="content">
      <q>${quote}</q>
      <a href="/quran/${surah}#${ayah}" target="_blank">
        (${surah} : ${ayah})
      </a>
    </div>`
  }
  async quote() {
    const quotes = await (await fetch('/api/quotes')).json()
    this.renderquote(quotes[0])

    let i = 0
    setInterval(() => {
      i = i == quotes.length - 1 ? 0 : i + 1
      this.renderquote(quotes[i])
    }, 7000)
  }

  updateIcons() {
    this.icons.forEach(
      (i) =>
        (i.textContent = this.main.classList.contains(
          i.parentElement.dataset.theme
        )
          ? 'done'
          : 'disabled_by_default')
    )
  }
  theme() {
    this.updateIcons()
    this.themes.forEach((a) =>
      a.addEventListener('click', () => {
        localStorage.setItem('theme', a.dataset.theme)
        this.main.className = localStorage.getItem('theme')
        this.updateIcons()
      })
    )
  }
}
