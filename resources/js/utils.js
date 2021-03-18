export const $_ = (el, selector) => el?.querySelector(selector);
export const $$_ = (el, selector) => el?.querySelectorAll(selector);

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

export class Base {
  constructor(argObj = {}, [s] = [false]) {
    for (const key in argObj)
      this[key] = argObj[key];

    this.init();
    !s && this.methods();
  }

  methods() {
    this.arrows();
    this.events();
  }

  toSubmit({ cond, url, method }) {
    this.submitCond = cond ?? false;
    this.fetchUrl = url ?? '';
    this.fetchMethod = method ?? 'POST';

    this.methods();
  }

  arrows() {
    this.submit = (e) => {
      e.preventDefault();
      Object.values(this.errors)
        .forEach(e => this.submitCond && (e.value = ''));

      const { raw, json } = this.getBody();

      (async () => {
        try {
          const data = await fetchEndpoint(this.fetchUrl, this.fetchMethod, json);
          this.handleData(data, raw);
        } catch (err) { console.log(err.message); }
      })();
    }
  }
}
