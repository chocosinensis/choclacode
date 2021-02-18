(() => {
  const socket = io();
  const [name, chatbox, form, users] = [
    document.querySelector('.links #name').textContent,
    document.querySelector('#chatbox'),
    document.querySelector('#sendmsg'),
    document.querySelector('.preview .users')
  ];

  let msgTrack = 0;

  socket.on('connection', () => socket.emit('newuser', { name }));
  socket.on('users', (data) => users.innerHTML = data.map(user => `<li>@${user}</li>`).join(''));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.msg.focus();
    const msg = form.msg.value;
    if (msg == '' || /^\s+$/g.test(msg)) return;
    socket.emit('newmsg', { name, msg });
    form.msg.value = '';
  });
  form.msg.addEventListener('keyup', (e) => {
    const selfs = chatbox.querySelectorAll('.self .msg .text');

    if (e.key == 'ArrowUp')
      form.msg.value = selfs?.[selfs.length - ++msgTrack]?.textContent ?? '';
    else if (e.key == 'ArrowDown')
      form.msg.value = selfs?.[selfs.length - --msgTrack]?.textContent ?? '';

    if (!form.msg.value)
      msgTrack = 0;
  });
  socket.on('sendmsg', ({ name: n, self, msg }) => {
    chatbox.innerHTML += n == name ? self : msg;
    chatbox.scrollTop = chatbox.scrollHeight;
  });
})();
