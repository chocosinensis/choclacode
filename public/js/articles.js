const articles = () => {
  const main = (path, method) => {
    const form = document.querySelector('form.article');
    const article = {
      title: document.querySelector('.preview .title'),
      body: document.querySelector('.preview article'),
    };
    const errors = {
      title: document.querySelector('.title-err.error'),
      body: document.querySelector('.body-err.error'),
      slug: path == 'create' ? document.querySelector('.slug-err.error') : ''
    };
    const slugify = (str) => str.toLowerCase().trim()
      .replace(/[\.?!]*/g, '').replace('&', 'and').replace(/[\s\W]/g, '-');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const [title, body, slug] = [
        form.title.value,
        form.body.value.replace(/<\/?script(.)*?>/g, ''),
        path == 'create' ? form.slug.value : location.pathname.slice(location.pathname.lastIndexOf('/edit/') + 6)
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
        }
        if (data.article) location.pathname = `/articles/${slug}`;
      } catch (err) { console.log(err.message); }
    });

    form.title.addEventListener('keyup', () => {
      form.slug.value = slugify(form.title.value);
      article.title.textContent = form.title.value;
    });
    form.body.addEventListener(
      'keyup', 
      () => article.body.innerHTML = form.body.value.replace(/<\/?script(.)*?>/g, '')
    );
  }
  const _delete = () => {
    const del = document.querySelector('a.delete');

    del.addEventListener('click', () => 
      fetch(`/articles/delete/${del.dataset.doc}`, { method: 'DELETE' })
        .then((res) => res.json())
        .then((data) => location.pathname = data.redirect)
        .catch(console.log))
  }

  return {
    create: () => main('create', 'POST'),
    edit: () => main(location.pathname.substr(10), 'PUT'),
    _delete
  };
}
