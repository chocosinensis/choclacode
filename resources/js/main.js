import { $, $_ } from './utils';

const header = $('header');
const bur = $_(header, 'button.burger');
const aside = $_(header, 'aside.links');

export const main = () => {
  (() => {
    let prevScrollPos = pageYOffset;
    document.addEventListener('scroll', () => {
      const currentScrollPos = pageYOffset;
      header.style.top = `${prevScrollPos > currentScrollPos ?
        0 : -90}px`;
      prevScrollPos = currentScrollPos;
    });
  })();
  (() => {
    bur.addEventListener('click', () => aside.classList.add('show'));
    aside.addEventListener('click', (e) => {
      if (e.target == aside)
        aside.classList.remove('show');
    });
  })();
  (() => {
    if (!localStorage.getItem('theme'))
      localStorage.setItem('theme', 'default');

    $('main').classList.add(localStorage.getItem('theme'));
  })();
}
