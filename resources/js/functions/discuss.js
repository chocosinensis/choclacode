import { $, $_, $$_, Base } from '../utils';

export class Discuss extends Base {
  constructor() {
    super();
  }

  init() {
    this.socket = io();
    this.name = $('.links #name').textContent;
    this.chatbox = $('#chatbox');
    this.form = $('#sendmsg');
    this.users = $('.preview .users');

    this.msgTrack = 0;
    this.likes = [];
  }

  arrows() {
    this.submitMsg = (e) => {
      e.preventDefault();
      this.form.msg.focus();
      const msg = this.form.msg.value;
      if (msg == '' || /^\s+$/g.test(msg)) return;
      this.socket.emit('newmsg__discuss', { name: this.name, msg });
      this.form.msg.value = '';
    }
    this.handleKeyDown = (e) => {
      const selfs = $$_(this.chatbox, '.self .msg .text');
      const { msg } = this.form;

      if (e.key === 'Enter') {
        if (!e.shiftKey) e.preventDefault();
        if (e.shiftKey)
          msg.scrollTop = msg.scrollHeight;
        else {
          msg.scrollTop = 0;
          this.submitMsg(e);
        }
      } else if (['ArrowUp', 'ArrowDown'].includes(e.key) && e.altKey) {
        if (e.key === 'ArrowUp')
          msg.value = selfs?.[selfs.length - ++this.msgTrack]?.textContent ?? '';
        else if (e.key === 'ArrowDown')
          msg.value = selfs?.[selfs.length - --this.msgTrack]?.textContent ?? '';
        msg.value = msg.value.substring(0, msg.value.length - 1);
        msg.focus();
      }

      if (!msg.value)
        this.msgTrack = 0;
    }

    const checkPrevSender = (n, l = this.chatbox.lastElementChild) => {
      if (l && !l.classList.contains('self')) {
        const name = $_(l, '.name');
        if (!name) {
          return checkPrevSender(n, l.previousSibling);
        }
        return name.textContent === `@${n}`;
      }
      return false;
    }
    this.sendmsg = ({ name: n, self, msg, msgNoName }) => {
      this.chatbox.innerHTML += checkPrevSender(n) ? msgNoName : n == this.name ? self : msg;
      [...this.chatbox.children].forEach((li) => {
        if (this.likes.includes(li.dataset.id))
          return;

        li.addEventListener('dblclick', () => {
          this.likes.push(li.dataset.id);
          this.socket.emit('msglike__discuss', { id: li.dataset.id });
        }, { once: true });
      });
      this.chatbox.scrollTop = this.chatbox.scrollHeight;
    }
    this.msglike = ({ id }) => {
      this.form.msg.focus();
      const li = $_(this.chatbox, `li[data-id="${id}"]`);
      if (!li)
        return;

      li.dataset.likes++;
      if (li.dataset.likes == 1)
        li.innerHTML += `<span class="like">❤️
        <span class="count">${li.dataset.likes}</span></span>`;
      else
        $_(li, '.like .count').textContent = li.dataset.likes;
    }
  }

  events() {
    this.domEvents();
    this.socketEvents();
  }
  domEvents() {
    this.form.addEventListener('submit', this.submitMsg);
    this.form.msg.addEventListener('keydown', this.handleKeyDown);
  }
  socketEvents() {
    this.socket.on('connection', () => this.socket.emit('newuser__discuss', { name: this.name }));
    this.socket.on('users__discuss',
      (data) => this.users.innerHTML = data.map(user => `<li>@${user}</li>`).join(''));
    this.socket.on('sendmsg__discuss', this.sendmsg);
    this.socket.on('msglike__discuss', this.msglike);
  }
}
