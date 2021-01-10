(() => {
  const bur = document.querySelector('button.burger');
  const aside = document.querySelector('aside.links');

  bur.addEventListener('click', () => aside.classList.add('show'));
  aside.addEventListener('click', (e) => {
    if (e.target == aside)
      aside.classList.remove('show');
  });
})();
