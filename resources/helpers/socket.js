const discuss = (io) => {
  const bot = 'chocoBot';
  let users = [];
  const getTime = (d) => {
    const h = d.getHours();
    const m = d.getMinutes();
    return `${h / 10 < 1 ? `0${h}`: h}:${m / 10 < 1 ? `0${m}`: m}`
  }
  const botMsg = (msg, time=getTime(new Date())) => ({ name: bot, msg, time })
  io.on('connection', (socket) => {
    let _name;
    socket.emit('connection');
    socket.on('newuser', ({ name }) => {
      const d = new Date();
      _name = name;
      users = users.includes({ name }) ? users : [...users, { name, id: socket.id }];
      socket.emit('sendmsg', botMsg(`Welcome to the discussion area, @${_name}! 👋️`));
      socket.broadcast.emit('sendmsg', botMsg(`@${_name} joined the discussion 😀️`));
      io.sockets.emit('users', users.map(({ name }) => name));
    });
    socket.on('newmsg', ({ name, msg }) => {
      const d = new Date();
      io.sockets.emit('sendmsg', { name, msg, time: getTime(d) });
      const mentions = msg.split(/\s+/g)
        .filter(m => m.startsWith('@')).map(m => m.slice(1));
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
        } else {
          const user = users.find(u => u.name == n);
          user && socket.to(user.id)
            .emit('sendmsg', botMsg(`@${name} mentioned you`));
        }
      });
    });
    socket.on('disconnect', () => {
      const d = new Date();
      users = users.filter(({ name }) => name != _name);
      socket.broadcast.emit('sendmsg', botMsg(`@${_name} left the discussion 😥️`));
      socket.broadcast.emit('users', users.map(({ name }) => name));
    });
  });
}

module.exports = { discuss };
