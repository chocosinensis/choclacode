const auth = () => {
  const main = (path) => {
    const form = $(`form#${path}`);
    const sup = path == 'signup';
    const errors = {
      username: $_(form, '.username.error'),
      email: sup ? $_(form, '.email.error') : '',
      password: $_(form, '.password.error')
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errors.username.textContent = errors.password.textContent = '';

      const [username, email, password] = [
        form.username.value.trim(),
        sup ? form.email.value.trim() : '',
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
          location.assign('/dashboard');
      } catch (err) { console.log(err.message); }
    });
  }
  const account = () => {
    const changeForm = $('form.change');
    const deleteForm = $('form.delete');
    const errors = {
      change: {
        current: $_(changeForm, '.error.current'),
        newPass: $_(changeForm, '.error.new')
      },
      _delete: {
        email: $_(deleteForm, '.error.email'),
        password: $_(deleteForm, '.error.password')
      }
    };

    changeForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const [current, newPass] = [
        changeForm.current.value,
        changeForm.new.value
      ];

      try {
        const res = await fetch('/auth/account', {
          method: 'PUT',
          body: JSON.stringify({ current, newPass }),
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        console.log(data);
        if (data.errors) {
          const { current, newPass } = errors.change;
          current.textContent = data.errors.password;
          newPass.textContent = data.errors.newPass;
        }
        if (data.user)
          location.assign('/dashboard');
      } catch (err) { console.log(err.message); }
    });
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
          location.assign('/');
      } catch (err) { console.log(err.message); }
    });
  }

  return {
    signup: () => main('signup'),
    login: () => main('login'),
    account
  }
}
