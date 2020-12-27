const auth = () => {
  const main = (path) => {
    const form = document.querySelector(`form#${path}`);
    const sup = path == 'signup';
    const errors = {
      username: form.querySelector('.username.error'),
      email: sup ? form.querySelector('.email.error') : '',
      password: form.querySelector('.password.error')
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errors.username.textContent = errors.password.textContent = '';

      const [username, email, password] = [
        form.username.value,
        sup ? form.email.value : '',
        form.password.value
      ]

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
        }
        if (data.user)
          location.pathname = '/dashboard';
      } catch (err) { console.log(err.message); }
    });
  }
  const account = () => {
    const deleteForm = document.querySelector('form.delete');
    const errors = {
      _delete: {
        email: deleteForm.querySelector('.error.email'),
        password: deleteForm.querySelector('.error.password')
      }
    };

    deleteForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const [email, password] = [
        deleteForm.email.value,
        deleteForm.password.value
      ];

      try {
        const res = await fetch('/auth/account', {
          method: 'DELETE',
          body: JSON.stringify({ email, password }),
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (data.errors) {
          const { email, password } = errors._delete;
          email.textContent = data.errors.email;
          password.textContent = data.errors.password;
        }
        if (data.user)
          location.pathname = '/';
      } catch (err) { console.log(err.message); }
    });
  }

  return {
    signup: () => main('signup'),
    login: () => main('login'),
    account
  }
}
