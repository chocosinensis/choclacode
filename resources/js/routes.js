import { $, matchUrl } from './utils';
import { Home } from './home';
import { Article } from './articles';
import { Auth } from './auth';
import { quran } from './quran';
import { Discuss } from './discuss';

export const routes = () => {
  if (matchUrl(/^\/$/g)) new Home();
  if (matchUrl(/^\/articles\/create$/g)) Article.create();
  if (matchUrl(/^\/articles\/.*\/edit$/g)) Article.edit();
  if (matchUrl(/^\/articles\/.+$/g)) {
    if ($('a.like')) Article.like();
    if ($('a.delete')) Article.delete();
  }
  if ($('input#search')) Article.search();
  if (matchUrl(/^\/auth\/login$/g)) Auth.login();
  if (matchUrl(/^\/auth\/signup$/g)) Auth.signup();
  if (matchUrl(/^\/auth\/account$/g)) Auth.account();
  if (matchUrl(/^\/quran(\/.*)?$/g)) quran();
  if (matchUrl(/^\/discuss$/g)) new Discuss();
}
