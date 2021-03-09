export const $_ = (el, selector) => el.querySelector(selector);
export const $$_ = (el, selector) => el.querySelectorAll(selector);

export const $ = (selector) => $_(document, selector);
export const $$ = (selector) => $$_(document, selector);

export const matchUrl = (url) => location.pathname.match(url);

export const fetchEndpoint = async (path, method, body) => {
  const res = await fetch(path, {
    method, body,
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res.json();

  return data;
}
