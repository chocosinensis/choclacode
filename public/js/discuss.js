(() => {
  const socket = io();
  const [name, chatbox, form, users] = [
    document.querySelector('.links #name').textContent,
    document.querySelector('#chatbox'),
    document.querySelector('#sendmsg'),
    document.querySelector('.preview .users')
  ];

  socket.on('connection', () => socket.emit('newuser', { name }));
  socket.on('users', (data) => users.innerHTML = data.map(user => `<li>@${user}</li>`).join(''));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.msg.focus();
    const msg = form.msg.value.replace(/<\/?script(.)*>/g, '').replace(/<link/g, '');
    if (msg == '' || /^\s+$/g.test(msg)) return;
    socket.emit('newmsg', { name, msg });
    form.msg.value = '';
  });
  socket.on('sendmsg', ({ name: n, self, msg }) => {
    chatbox.innerHTML += n == name ? self : msg;
    chatbox.scrollTop = chatbox.scrollHeight;
  });
})();
