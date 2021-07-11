import { $, $_ } from '../utils'

export const main = () => {
  const header = $('header')
  const bur = $_(header, 'button.burger')
  const aside = $_(header, 'aside.links')

  ;(() => {
    let prevScrollPos = pageYOffset
    document.addEventListener('scroll', () => {
      const currentScrollPos = pageYOffset
      header.style.top = `${prevScrollPos > currentScrollPos ? 0 : -90}px`
      prevScrollPos = currentScrollPos
    })
  })()
  ;(() => {
    bur.addEventListener('click', () => aside.classList.add('show'))
    aside.addEventListener('click', (e) => {
      if (e.target == aside) {
        aside.classList.add('reverse')
        // prettier-ignore
        aside.addEventListener('animationend', () => {
          aside.classList.remove('show')
          aside.classList.remove('reverse')
        }, { once: true })
      }
    })
  })()
  ;(() => {
    if (!$.l('theme')) $.l('theme', 'default')

    $('main').classList.add($.l('theme'))
  })()
}

export * from './routes'
