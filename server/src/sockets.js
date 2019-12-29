const socketIO = require('socket.io');

module.exports = (server) => {
  const io = socketIO(server);

  const state = {};

  io.on('connection', (socket) => {
    console.log('Total connections:', Object.keys(state).length);
    console.log('a user connected', socket.id);
    socket.on('location', (location) => {
      state[socket.id] = location;
      io.emit('state', state);
    });
    socket.on('disconnect', () => {
      console.log('a user disconnected', socket.id);
      console.log('Total connections:', Object.keys(state).length);
      delete state[socket.id];
    });
  });
};
