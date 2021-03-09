import marked from 'marked';

import { $, $_, $$, fetchEndpoint } from './utils';

const textify = (str) => str.trim().replace(/(<\/?script(.)*?>|<\/?style>|<link)/g, '');
const slugify = (str) => str.toLowerCase().trim()
  .replace(/[\.?!]*/g, '').replace('&', 'and').replace(/[\s\W]/g, '-');

export class Article {
  constructor(path, method) {
    this.path = path;
    this.method = method;

    this.init();
    this.arrows();
    this.events();
  }

  init() {
    this.form = $('form.article');
    this.article = {
      title: $('.preview .title'),
      body: $('.preview article')
    };
    this.errors = {
      title: $_(this.form, '.title-err.error'),
      body: $_(this.form, '.body-err.error'),
      slug: this.path == 'create' ? $_(this.form, '.slug-err.error') : ''
    };
  }

  arrows() {
    this.submit = async (e) => {
      e.preventDefault();
      Object.values(this.errors)
        .forEach(e => this.path == 'create' && (e.value = ''));  

      const { raw: { slug }, json } = this.getBody();

      try {
        const data = await fetchEndpoint(
          `/articles/${this.path == 'create' ?
            this.path : `${slug}/${this.path}`}`,
          this.method, json
        );

        this.error(data, { slug });
      } catch (err) { console.log(err.message); }
    }
  }

  events() {
    this.form.addEventListener('submit', this.submit);
    this.form.title.addEventListener('keyup', () => {
      this.form.slug.value = slugify(this.form.title.value);
      article.title.textContent = this.form.title.value.trim();
    });
    this.form.body.addEventListener(
      'keyup', 
      () => article.body.innerHTML = marked(textify(this.form.body.value))
    );
  }

  getBody() {
    const [title, body, slug] = [
      this.form.title.value.trim(),
      textify(this.form.body.value),
      this.path == 'create' ?
        slugify(this.form.slug.value) :
        location.pathname.split('/').slice(2)[0]
    ];

    return {
      raw: { title, body, slug },
      json: JSON.stringify(this.path == 'create' ?
        { title, body, slug } : { title, body })
    };
  }

  error(data, { slug }) {
    if (data.errors) {
      this.errors.title.textContent = data.errors.title;
      this.errors.body.textContent = data.errors.body;
      if (this.path == 'create') this.errors.slug.textContent = data.errors.slug;
    } else if (data.article)
      location.assign(`/articles/${slug}`);
  }  
}

Article.delete = () => {
  const del = $('a.delete');
  del.addEventListener('click', () => 
    fetch(`/articles/${del.dataset.doc}/delete`, { method: 'DELETE' })
      .then((res) => res.json())
      .then((data) => location.assign(data.redirect))
      .catch(console.log));
}

Article.search = () => {
  const [input, articlesUL, articles] = [
    $('input#search'),
    $('ul.articles'),
    $$('ul.articles li.link')
  ];
  input.addEventListener('keyup', () => {
    const value = input.value.trim().toLowerCase();
    const selector = value.startsWith('@') ? '.author' : 'h1';
    articlesUL.innerHTML = '';
    [...articles].filter((li) => $_(li, `a ${selector}`)
        .textContent.toLowerCase()
        .includes(value))
      .forEach((li) => articlesUL.appendChild(li));
  });
}
