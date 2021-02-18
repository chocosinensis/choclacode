const marked = require('marked');

const discuss = (io) => {
  const bot = 'chocoBot';
  const helpMsg = (name) => `Here you go @${name} <br>
  @user <br> &nbsp;&nbsp; - mention @user <br>
  @chocoBot help <br> &nbsp;&nbsp; - show this message
  @chocoBot lstyle <br> &nbsp;&nbsp; - show list of stylistic commands
  @chocoBot hint <br> &nbsp;&nbsp; - show some hints <br>`;
  const styleMsg = (name) => `Here you go @${name} <br>
  \\*\\*Bold\\*\\* / \\_\\_Bold\\_\\_ - __Bold__
  \\*Italics\\* / \\_Italics\\_ - _Italics_
  \\~\\~Strike\\~\\~ - ~~Strike~~
  \\\`Mono\\\` - \`Mono\``;
  const hintmsg = `Double tap a message to react to it ❤️
  Press up or down key to navigate your sent messages ✏️
  -p [ ... @user1 , @user2 ] &lt;msg&gt; <br> &nbsp;&nbsp; - send private message to mentioned users`;

  let users = [];

  const getTime = (d = new Date()) => {
    const h = d.getHours();
    const m = d.getMinutes();
    return `${h / 10 < 1 ? `0${h}`: h}:${m / 10 < 1 ? `0${m}`: m}`
  }
  const msgify = (msg) => marked(msg.trim()
  .replace(/\n+/g, '<br>').replace(/&lt;br&gt;/g, '<br>'));
  const cleanify = (msg) => msg.replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');
  const markupify = ({ name, msg, time }) => {
    msg = msgify(msg.split(' ')
    .map(m => m.startsWith('@') ? `<span class="title">${m}</span>` : cleanify(m))
    .join(' '));
    const id = `msg-${Math.random()}-_-${Math.random()}`
    return {
      name, id,
      self: `<li class="self" data-id="${id}" data-likes="0">
        <div class="msg">
          <span class="text">${msg}</span>
          <span class="time">${time}</span>
        </div>
      </li>`,
      msg: `<li data-id="${id}" data-likes="0">
        <span class="name">@${name}</span>
        <div class="msg">
          <span class="text">${msg}</span>
          <span class="time">${time}</span>
        </div>
      </li>`
    };
  }
  const botMsg = (msg, time = getTime()) => markupify({ name: bot, msg, time });
  const like = (id) => io.sockets.emit('msglike', { id });
  const likeMsg = (id, msg) => {
    like(id);
    return msg;
  }

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
            msg.toLowerCase().includes('thank') ? likeMsg(msgToSend.id, `My pleasure @${name} 😊️`) :
            msg.toLowerCase().includes('help') ? helpMsg(name) :
            msg.toLowerCase().includes('lstyle') ? styleMsg(name) :
            msg.toLowerCase().includes('hint') ? hintmsg :
            msg == `@${n}` ? `I am here @${name} 🙂️` : `Yeah dear @${name}`
          ));
        else if (n.toLowerCase() == 'everyone')
          io.sockets.emit('sendmsg', likeMsg(msgToSend.id, `@${name} mentioned everyone`));
        else {
          const user = users.find(u => u.name == n);
          if (user) {
            if (msg.match(/^\s*-p\s+/g))
              socket.to(user.id).emit('sendmsg', msgToSend);
            else
              socket.to(user.id).emit('sendmsg', botMsg(`@${name} mentioned you`));
          }
        }
      });
    });
    socket.on('msglike', ({ id }) => like(id));
    socket.on('disconnect', () => {
      users = users.filter(({ name }) => name != _name);
      socket.broadcast.emit('sendmsg', botMsg(`@${_name} left the discussion 😥️`));
      socket.broadcast.emit('users', users.map(({ name }) => name));
    });
  });
}

module.exports = { discuss };
