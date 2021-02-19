(() => {
  const socket = io();
  const [name, chatbox, form, users] = [
    document.querySelector('.links #name').textContent,
    document.querySelector('#chatbox'),
    document.querySelector('#sendmsg'),
    document.querySelector('.preview .users')
  ];

  let msgTrack = 0;
  let likes = [];

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

  socket.on('connection', () => socket.emit('newuser', { name }));
  socket.on('users', (data) => users.innerHTML = data.map(user => `<li>@${user}</li>`).join(''));
  socket.on('sendmsg', ({ name: n, self, msg }) => {
    chatbox.innerHTML += n == name ? self : msg;
    [...chatbox.children].forEach((li) => {
      if (likes.includes(li.dataset.id))
        return;

      li.addEventListener('dblclick', () => {
        likes.push(li.dataset.id);
        socket.emit('msglike', { id: li.dataset.id });
      }, { once: true });
    });
    chatbox.scrollTop = chatbox.scrollHeight;
  });
  socket.on('msglike', ({ id }) => {
    const li = chatbox.querySelector(`li[data-id="${id}"]`);
    if (!li)
      return;

    li.dataset.likes++;
    if (li.dataset.likes == 1)
      li.innerHTML += `<span class="like">❤️
      <span class="count">${li.dataset.likes}</span></span>`;
    else
      li.querySelector('.like .count').textContent = li.dataset.likes;
  });
})();
