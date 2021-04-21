import { makeRoutes } from '../utils'
import { Home, Article, Auth, quran, Discuss } from '../functions'

export const routes = makeRoutes([
  [/^\/$/g, () => new Home()],
  [/^\/articles\/create$/g, Article.create],
  [/^\/articles\/.+\/edit$/g, Article.edit],
  [/^\/articles\/.+$/g, Article.details],
  [/^.+$/g, Article.search],
  [/^\/auth\/login$/g, Auth.login],
  [/^\/auth\/signup$/g, Auth.signup],
  [/^\/auth\/account$/g, Auth.account],
  [/^\/quran(\/.*)?$/g, quran],
  [/^\/discuss$/g, () => new Discuss()],
])
