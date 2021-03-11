import { $, $_, Base } from './utils';

export class Auth extends Base {
  constructor(path) {
    super({ path }, [true]);
    super.toSubmit({ cond: this.sup, url: `/auth/${this.path}` });
  }

  init() {
    this.sup = this.path == 'signup';
    this.form = $(`form#${this.path}`);
    this.errors = {
      username: $_(this.form, '.username.error'),
      email: this.sup ? $_(this.form, '.email.error') : '',
      password: $_(this.form, '.password.error')
    };
  }

  // arrows() {
  //   this.submit = async (e) => {
  //     e.preventDefault();
  //     Object.values(this.errors)
  //       .forEach(e => this.sup && (e.value = ''));

  //     const { json } = this.getBody();

  //     try {
  //       const data = await fetchEndpoint(`/auth/${this.path}`, 'POST', json);
  //       this.handleData(data);
  //     } catch (err) { console.log(err.message); }
  //   }
  // }

  events() {
    this.form.addEventListener('submit', this.submit);
  }

  getBody() {
    const [username, email, password] = [
      this.form.username.value.trim(),
      this.sup ? this.form.email.value.trim() : '',
      this.form.password.value
    ];

    const obj = this.sup ? { username, email, password } : { username, password };

    return {
      json: JSON.stringify(obj),
      raw: obj
    };
  }

  handleData(data) {
    if (data.errors) {
      this.errors.username.textContent = data.errors.username;
      this.errors.password.textContent = data.errors.password;
      if (this.sup)
        this.errors.email.textContent = data.errors.email;
    }
    if (data.user)
      location.assign(
        new URLSearchParams(location.search).get('next') ??
        '/dashboard'
      );
  }
}

class ChangePassword extends Base {
  constructor() {
    super({}, [true]);
    super.toSubmit({
      cond: true,
      method: 'PUT',
      url: '/auth/account'
    });
  }

  init() {
    this.changeForm = $('form.change');
    this.errors = {
      current: $_(this.changeForm, '.error.current'),
      newPass: $_(this.changeForm, '.error.new')
    };
  }

  events() {
    this.changeForm.addEventListener('submit', this.submit);
  }

  getBody() {
    const [current, newPass] = [
      this.changeForm.current.value,
      this.changeForm.new.value
    ];

    const raw = { current, newPass };

    return {
      raw,
      json: JSON.stringify(raw)
    };
  }

  handleData(data) {
    if (data.errors) {
      const { current, newPass } = this.errors;
      current.textContent = data.errors.password;
      newPass.textContent = data.errors.newPass;
    }
    if (data.user)
      location.assign('/dashboard');
  }
}

class DeleteAccount extends Base {
  constructor() {
    super({}, [true]);
    super.toSubmit({
      cond: true,
      method: 'DELETE',
      url: '/auth/account'
    });
  }

  init() {
    this.deleteForm = $('form.delete');
    this.errors = {
      email: $_(this.deleteForm, '.error.email'),
      password: $_(this.deleteForm, '.error.password')
    };
  }

  events() {
    this.deleteForm.addEventListener('submit', this.submit);
  }

  getBody() {
    const [email, password] = [
      this.deleteForm.email.value,
      this.deleteForm.password.value
    ];

    const raw = { email, password };

    return {
      raw,
      json: JSON.stringify(raw)
    };
  }

  handleData(data) {
    if (data.errors) {
      const { email, password } = this.errors;
      email.textContent = data.errors.email;
      password.textContent = data.errors.password;
    }
    if (data.user)
      location.assign('/');
  }
}

// class AuthAccount {
//   constructor() {
//     this.init();
//     this.events();
//   }

//   init() {
//     this.changeForm = $('form.change');
//     this.deleteForm = $('form.delete');
//     this.errors = {
//       change: {
//         current: $_(this.changeForm, '.error.current'),
//         newPass: $_(this.changeForm, '.error.new')
//       },
//       _delete: {
//         email: $_(this.deleteForm, '.error.email'),
//         password: $_(this.deleteForm, '.error.password')
//       }
//     };
//   }

//   events() {
//     this.changeForm.addEventListener('submit', this.changesubmit);
//     this.deleteForm.addEventListener('submit', this.deletesubmit);
//   }

//   async changesubmit() {
//     e.preventDefault();

//     const [current, newPass] = [
//       this.changeForm.current.value,
//       this.changeForm.new.value
//     ];

//     try {
//       const data = await fetchEndpoint(
//         '/auth/account', 'PUT',
//         JSON.stringify({ current, newPass })  
//       );
//       if (data.errors) {
//         const { current, newPass } = errors.change;
//         current.textContent = data.errors.password;
//         newPass.textContent = data.errors.newPass;
//       }
//       if (data.user)
//         location.assign('/dashboard');
//     } catch (err) { console.log(err.message); }
//   }

//   async deletesubmit() {
//     e.preventDefault();

//     const [email, password] = [
//       this.deleteForm.email.value,
//       this.deleteForm.password.value
//     ];

//     try {
//       const data = await fetchEndpoint(
//         '/auth/account', 'DELETE',
//         JSON.stringify({ email, password })
//       );
//       if (data.errors) {
//         const { email, password } = this.errors._delete;
//         email.textContent = data.errors.email;
//         password.textContent = data.errors.password;
//       }
//       if (data.user)
//         location.assign('/');
//     } catch (err) { console.log(err.message); }
//   }
// }

Auth.login = () => new Auth('login');
Auth.signup = () => new Auth('signup');
Auth.account = () => {
  new ChangePassword();
  new DeleteAccount();
}
