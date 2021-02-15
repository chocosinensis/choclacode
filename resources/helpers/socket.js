const discuss = (io) => {
  const bot = 'chocoBot';
  const helpMsg = (name) => `Here you go @${name} <br><br> @user <br> &nbsp;&nbsp; - mention @user <br><br>
  @chocoBot help <br> &nbsp;&nbsp; - show this message <br><br>
  -p [ ... @user1 , @user2 ] &lt;msg&gt; <br> &nbsp;&nbsp; - send private message to mentioned users`;

  let users = [];

  const getTime = (d = new Date()) => {
    const h = d.getHours();
    const m = d.getMinutes();
    return `${h / 10 < 1 ? `0${h}`: h}:${m / 10 < 1 ? `0${m}`: m}`
  }
  const msgify = (msg) => msg
    .replace(/<\/?script(.)*>/g, '&lt;script&gt;')
    .replace(/<link/g, '&lt;link&gt;')
    .replace(/<\/?style>/g, '&lt;style&gt;');
  const markupify = ({ name, msg, time }) => {
    msg = msgify(msg.split(' ')
      .map(m => m.startsWith('@') ? `<span class="title">${m}</span>` : m)
      .join(' '));
    return {
      name,
      self: `<li class="self">
        <div class="msg">
          <span class="text">${msg}</span>
          <span class="time">${time}</span>
        </div>
      </li>`,
      msg: `<li>
        <span class="name">@${name}</span>
        <div class="msg">
          <span class="text">${msg}</span>
          <span class="time">${time}</span>
        </div>
      </li>`
    };
  }
  const botMsg = (msg, time = getTime()) => markupify({ name: bot, msg, time });

  io.on('connection', (socket) => {
    let _name;
    socket.emit('connection');
    socket.on('newuser', ({ name }) => {
      _name = name;
      users = users.includes({ name }) ? users : [...users, { name, id: socket.id }];
      socket.emit('sendmsg', botMsg(`Welcome to the discussion area, @${_name} ! 👋️`));
      socket.broadcast.emit('sendmsg', botMsg(`@${_name} joined the discussion 😀️`));
      io.sockets.emit('users', users.map(({ name }) => name));
    });
    socket.on('newmsg', ({ name, msg }) => {
      const msgToSend = markupify({ name, msg, time: getTime() });
      const mentions = msg.split(/\s+/gs)
        .filter(m => m.startsWith('@')).map(m => m.slice(1));
      socket.emit('sendmsg', msgToSend);
      if (!msg.match(/^\s*-p\s+/g))
        socket.broadcast.emit('sendmsg', msgToSend);
      mentions.length && mentions.forEach(n => {
        if (n == 'chocoBot')
          io.sockets.emit('sendmsg', botMsg(
            msg.toLowerCase().includes('thank') ? `My pleasure @${name} 😊️` :
            msg.toLowerCase().includes('help') ? helpMsg(name) :
            msg == `@${n}` ? `I am here @${name} 🙂️` : `Yeah dear @${name}`
          ));
        else if (n.toLowerCase() == 'everyone')
          io.sockets.emit('sendmsg', botMsg(`@${name} mentioned everyone`));
        else {
          const user = users.find(u => u.name == n);
          if (user) {
            if (msg.match(/^\s*-p\s+/g)) {
              socket.to(user.id).emit('sendmsg', msgToSend);
            } else
              socket.to(user.id).emit('sendmsg', botMsg(`@${name} mentioned you`));
          }
        }
      });
    });
    socket.on('disconnect', () => {
      users = users.filter(({ name }) => name != _name);
      socket.broadcast.emit('sendmsg', botMsg(`@${_name} left the discussion 😥️`));
      socket.broadcast.emit('users', users.map(({ name }) => name));
    });
  });
}

module.exports = { discuss };
