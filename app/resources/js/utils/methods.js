export const fetchEndpoint = async (path, method, body) => {
  const res = await fetch(path, {
    method,
    body,
    headers: { 'Content-Type': 'application/json' },
  })
  const data = await res.json()

  return data
}

export const makeRoutes = (routes) => () => {
  routes.forEach(([url, callback]) => {
    if (location.pathname.match(url)) callback()
  })
}
