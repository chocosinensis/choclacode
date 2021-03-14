import { $, $_, Base, fetchEndpoint } from './utils';

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

class ChangeProfileImage extends Base {
  constructor() {
    super();
  }

  init() {
    this.uploadform = $('form.image');
    this.urlform = $('form.url');
    this.image = $('.account img.avatar');
    this.upload = $('span.upload');
    this.img = $('span.imgdata')?.dataset?.img ?? null;
  }

  arrows() {
    this.uploadImage = async () => {
      const data = await fetch('/images', {
        method: 'POST',
        body: new FormData(this.uploadform)
      }).then((r) => r.json());

      if (data.image) {
        const { image, id } = await fetchEndpoint(
          '/auth/account/image', 'PUT',
          JSON.stringify({ image: data.image })
        );
        this.image.src = image;
        this.img && await fetchEndpoint(`/images/${this.img}`, 'DELETE');
        this.img = id;
      }
    }
    this.urlImage = async (e) => {
      e.preventDefault();

      const { image } = await fetchEndpoint(
        '/auth/account/image', 'PUT',
        JSON.stringify({ image: this.urlform.urlinput.value })
      );
      this.urlform.urlinput.value = '';
      this.image.src = image;

      this.img && await fetchEndpoint(`/images/${this.img}`, 'DELETE');
      if ($('span.imgdata'))
        $('span.imgdata').dataset.img = '';
      this.img = null;
    }
  }

  events() {
    this.uploadform.image.addEventListener('change', this.uploadImage, { once: true });
    this.upload.addEventListener('click',
      () => this.uploadform.image.click());
    this.urlform.addEventListener('submit', this.urlImage, { once: true });
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

Auth.login = () => new Auth('login');
Auth.signup = () => new Auth('signup');
Auth.account = () => {
  new ChangeProfileImage();
  new ChangePassword();
  new DeleteAccount();
}
