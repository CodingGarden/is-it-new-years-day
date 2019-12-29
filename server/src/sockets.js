const socketIO = require('socket.io');

module.exports = (server) => {
  const io = socketIO(server);

  const state = {};
  const lastMessage = {};
  const errors = {};
  let updates = {
    totalConnections: 0,
    move: {},
    disconnect: {}
  };
  let hasUpdate = false;

  io.on('connection', (socket) => {
    hasUpdate = true;
    updates.totalConnections = Object.keys(state).length + 1;
    console.log('connected', socket.id);
    console.log('Total connections:', updates.totalConnections);
    // no tolerence for funny business
    const noFunnyBusiness = (message) => {
      errors[socket.id] = errors[socket.id] || 0;
      errors[socket.id] += 1;
      socket.emit('update-error', message);
      console.error(socket.id, message);
      if (errors[socket.id] > 10) {
        console.error(socket.id, 'Max error limit reached.', 'Disconnecting...');
        socket.disconnect(true);
      }
    };
    socket.emit('state', state);
    // eslint-disable-next-line
    socket.on('location', (location) => {
      if (lastMessage[socket.id]) {
        const diff = Date.now() - lastMessage[socket.id];
        if (diff < 80) {
          return noFunnyBusiness(`Sending updates too fast. Updates should be sent no faster than 100 ms. Sent update: ${diff} ms`);
        }
      }
      if (location.x < 0 || location.x > 1) {
        return noFunnyBusiness('Invalid X Value.');
      }
      if (location.y < 0 || location.y > 1) {
        return noFunnyBusiness('Invalid Y Value.');
      }
      lastMessage[socket.id] = Date.now();
      state[socket.id] = location;
      updates.move[socket.id] = updates.move[socket.id] || [];
      const socketUpdates = updates.move[socket.id];
      const lastLocation = socketUpdates[socketUpdates.length - 1];
      if (
        lastLocation
        && (Math.abs(lastLocation.x - location.x) > 0.001
        || Math.abs(lastLocation.y - location.y) > 0.001)
      ) {
        socketUpdates.push(location);
        hasUpdate = true;
      } else if (!lastLocation) {
        socketUpdates.push(location);
        hasUpdate = true;
      }
    });
    socket.on('disconnect', () => {
      console.log('disconnected', socket.id);
      delete state[socket.id];
      delete errors[socket.id];
      updates.disconnect[socket.id] = true;
      hasUpdate = true;
      updates.totalConnections = Object.keys(state).length;
      console.log('Total connections:', updates.totalConnections);
    });
  });

  setInterval(() => {
    if (hasUpdate) {
      io.emit('update', updates);
      updates = {
        totalConnections: Object.keys(state).length,
        move: {},
        disconnect: {}
      };
      hasUpdate = false;
    }
  }, 500);
};
