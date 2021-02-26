const $_ = (el, selector) => el.querySelector(selector);
const $$_ = (el, selector) => el.querySelectorAll(selector);
const $ = (selector) => $_(document, selector);
const $$ = (selector) => $$_(document, selector);

(() => {
  const bur = $('button.burger');
  const aside = $('aside.links');

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
