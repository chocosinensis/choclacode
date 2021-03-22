export const $_ = (el, selector) => el?.querySelector(selector);
export const $$_ = (el, selector) => el?.querySelectorAll(selector);

export const $ = (selector) => $_(document, selector);
export const $$ = (selector) => $$_(document, selector);
