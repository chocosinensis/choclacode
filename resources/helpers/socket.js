const discuss = (io) => {
  const bot = 'chocoBot';
  const helpMsg = `Discussion area <br><br> @user <br> &nbsp;&nbsp; - mention @user <br><br>
Help @chocoBot <br> &nbsp;&nbsp; - show this message <br><br>
-p [ ... @user1 , @user2 ] &lt;msg&gt; <br> &nbsp;&nbsp; - sends private message to mentioned users`;

  let users = [];

  const getTime = (d = new Date()) => {
    const h = d.getHours();
    const m = d.getMinutes();
    return `${h / 10 < 1 ? `0${h}`: h}:${m / 10 < 1 ? `0${m}`: m}`
  }
  const botMsg = (msg, time = getTime()) => ({ name: bot, msg, time });

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
      const msgToSend = { name, msg, time: getTime() };
      const mentions = msg.split(/\s+/g)
        .filter(m => m.startsWith('@')).map(m => m.slice(1));
      socket.emit('sendmsg', msgToSend);
      if (!msg.match(/^\s*-p\s+/g))
        socket.broadcast.emit('sendmsg', msgToSend);
      mentions.length && mentions.forEach(n => {
        if (n == 'chocoBot') {
          if (
            msg.toLowerCase().includes('thanks') ||
            msg.toLowerCase().includes('thank you') ||
            msg.toLowerCase().includes('thank')
          )
            io.sockets.emit('sendmsg', botMsg(`My pleasure @${name} 😊️`));
          else if (msg == `@${n}`)
            io.sockets.emit('sendmsg', botMsg(`I am here @${name} 🙂️`));
          else if (msg.toLowerCase().includes('help'))
            io.sockets.emit('sendmsg', botMsg(helpMsg));
        } else {
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
