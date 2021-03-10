import { $, matchUrl } from './utils';
import { Home } from './home';
import { Article } from './articles';
import { Auth } from './auth';
import { quran } from './quran';
import { Discuss } from './discuss';

const bur = $('button.burger');
const aside = $('aside.links');

export const main = () => {
  bur.addEventListener('click', () => aside.classList.add('show'));
  aside.addEventListener('click', (e) => {
    if (e.target == aside)
      aside.classList.remove('show');
  });

  if (!localStorage.getItem('theme'))
    localStorage.setItem('theme', 'default');

  $('main').classList.add(localStorage.getItem('theme'));
}

export const routes = () => {
  if (matchUrl(/^\/$/g)) new Home();
  if (matchUrl(/^\/articles\/create$/g)) Article.create();
  if (matchUrl(/^\/articles\/.*\/edit$/g)) Article.edit();
  if (matchUrl(/^\/articles\/.+$/g) && $('ul.actions')) Article.delete();
  if ($('input#search')) Article.search();
  if (matchUrl(/^\/auth\/login$/g)) Auth.login();
  if (matchUrl(/^\/auth\/signup$/g)) Auth.signup();
  if (matchUrl(/^\/auth\/account$/g)) Auth.account();
  if (matchUrl(/^\/quran(\/.*)?$/g)) quran();
  if (matchUrl(/^\/discuss$/g)) new Discuss();
}
