const discuss = () => {
  const socket = io();
  const name = document.querySelector('.links #name').textContent;
  const chatbox = document.querySelector('#chatbox');
  const form = document.querySelector('#sendmsg');
  const users = document.querySelector('.preview .users');
  const sendmsg = (data, isself=false) => 
    chatbox.innerHTML += isself ? 
      `<li class="self">
        <span class="msg">${data}</span>
      </li>` : 
      `<li>
        <span class="name">${data.name}</span>
        <span class="msg">${data.msg}</span>
      </li>`;

  socket.on('connection', () => socket.emit('newuser', { name }));
  socket.on('users', (data) => users.innerHTML = data.map(user => `<li>${user}</li>`).join(''));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = form.msg.value.replace(/<\/?script(.)*>/g, '');
    if (msg == '' || /^\s+$/g.test(msg)) return;
    socket.emit('newmsg', { name, msg });
    sendmsg(msg, true);
    form.msg.value = '';
  });
  socket.on('sendmsg', sendmsg);
  socket.on('disconnect', () => socket.emit('userout', { name }));
}
