import { $ } from './utils';

const removePadding = (el) => {
  el && (el.parentElement.style.padding = '10px 0');
}

export const quran = () => {
  removePadding($('.quran'));
  removePadding($('.surah'));
}
