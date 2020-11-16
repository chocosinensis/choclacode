const auth = () => {
  const main = (path) => {
    const form = document.querySelector(`form#${path}`);
    const sup = path == 'signup';
    const errors = {
      username: document.querySelector('.username.error'),
      email: sup ? document.querySelector('.email.error') : '',
      password: document.querySelector('.password.error')
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errors.username.textContent = errors.password.textContent = '';

      const username = form.username.value;
      const email = sup ? form.email.value : '';
      const password = form.password.value;

      try {
        const res = await fetch(`/auth/${path}`, { 
          method: 'POST', 
          body: JSON.stringify(sup ? { username, email, password } : { username, password }),
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (data.errors) {
          errors.username.textContent = data.errors.username;
          errors.password.textContent = data.errors.password;
          if (sup)
            errors.email.textContent = data.errors.email;
          console.log(data.errors);
        }
        if (data.user)
          location.pathname = sup ? '/auth/account' : '/';
      } catch (err) { console.log(err.message); }
    });
  }

  return {
    signup: () => main('signup'),
    login: () => main('login')
  }
}
