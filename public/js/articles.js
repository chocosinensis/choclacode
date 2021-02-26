const articles = () => {
  const main = (path, method) => {
    const form = $('form.article');
    const article = {
      title: $('.preview .title'),
      body: $('.preview article'),
    };
    const errors = {
      title: $_(form, '.title-err.error'),
      body: $_(form, '.body-err.error'),
      slug: path == 'create' ? $_(form, '.slug-err.error') : ''
    };
    const textify = (str) => str.trim().replace(/(<\/?script(.)*?>|<\/?style>|<link)/g, '');
    const slugify = (str) => str.toLowerCase().trim()
      .replace(/[\.?!]*/g, '').replace('&', 'and').replace(/[\s\W]/g, '-');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      Object.values(errors).forEach(e => path == 'create' && (e.value = ''));

      const [title, body, slug] = [
        form.title.value.trim(),
        textify(form.body.value),
        path == 'create' ? slugify(form.slug.value) : location.pathname.split('/').slice(2)[0]
      ];

      try {
        const res = await fetch(`/articles/${path}`, {
          method,
          body: JSON.stringify(
            path == 'create' ? { title, body, slug } : { title, body }
          ),
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (data.errors) {
          errors.title.textContent = data.errors.title;
          errors.body.textContent = data.errors.body;
          if (path == 'create') errors.slug.textContent = data.errors.slug;
        } else if (data.article)
          location.assign(`/articles/${slug}`);
      } catch (err) { console.log(err.message); }
    });

    form.title.addEventListener('keyup', () => {
      form.slug.value = slugify(form.title.value);
      article.title.textContent = form.title.value.trim();
    });
    form.body.addEventListener(
      'keyup', 
      () => article.body.innerHTML = marked(textify(form.body.value))
    );
  }
  const _delete = () => {
    const del = $('a.delete');

    del.addEventListener('click', () => 
      fetch(`/articles/${del.dataset.doc}/delete`, { method: 'DELETE' })
        .then((res) => res.json())
        .then((data) => location.assign(data.redirect))
        .catch(console.log))
  }

  const search = () => {
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

  return {
    create: () => main('create', 'POST'),
    edit: () => main(location.pathname.substr(10), 'PUT'),
    _delete, search
  };
}
