const socketIO = require('socket.io');

module.exports = (server) => {
  const io = socketIO(server);

  const state = {};

  io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    console.log('Total connections:', Object.keys(state).length);
    socket.on('location', (location) => {
      if (location.x < 0 || location.x > 1) return;
      if (location.y < 0 || location.y > 1) return;
      state[socket.id] = location;
    });
    socket.on('disconnect', () => {
      console.log('a user disconnected', socket.id);
      console.log('Total connections:', Object.keys(state).length);
      delete state[socket.id];
    });
  });

  setInterval(() => {
    io.emit('state', state);
  }, 500);
};
