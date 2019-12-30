const socketIO = require('socket.io');

const {
  MAX_ERROR_COUNT = 20
} = process.env;

module.exports = (server) => {
  const io = socketIO(server);

  const state = {};
  const lastMessage = {};
  const lastFirework = {};
  const errors = {};
  let updates = {
    totalConnections: 0,
    move: {},
    disconnect: {},
    fireworks: [],
  };
  let hasUpdate = false;

  io.on('connection', (socket) => {
    hasUpdate = true;
    updates.totalConnections = Object.keys(state).length + 1;
    console.log('connected', socket.id);
    console.log('Total connections:', updates.totalConnections);
    // no tolerence for funny business
    const noFunnyBusiness = (message, drop = false) => {
      errors[socket.id] = errors[socket.id] || 0;
      errors[socket.id] += 1;
      socket.emit('update-error', message);
      console.error(socket.id, message);
      if (drop || errors[socket.id] > MAX_ERROR_COUNT) {
        const error = 'Max error limit reached.';
        socket.emit('update-error', error);
        console.error(socket.id, error, 'Disconnecting...');
        socket.disconnect(true);
      }
      return false;
    };

    function valid(lastTime, location, type = 'updates', maxDiff = 80) {
      if (!location || !location.x || !location.y) {
        console.error(socket.id, 'invalid data', location);
        return noFunnyBusiness('Stop it, get some help.', true);
      }
      if (lastTime[socket.id]) {
        const diff = Date.now() - lastTime[socket.id];
        if (diff < maxDiff) {
          return noFunnyBusiness(`Sending ${type} too fast. ${type} should be sent no faster than ${maxDiff} ms. Sent update: ${diff} ms`);
        }
      }
      if (location.x < 0 || location.x > 1) {
        return noFunnyBusiness('Invalid X Value.');
      }
      if (location.y < 0 || location.y > 1) {
        return noFunnyBusiness('Invalid Y Value.');
      }
      return true;
    }

    socket.emit('state', state);
    // eslint-disable-next-line
    socket.on('location', (location) => {
      if (!valid(lastMessage, location)) return;
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
    socket.on('firework', (location) => {
      if (!valid(lastFirework, location, 'fireworks', 5000)) return;
      if (updates.fireworks.length >= 10) return;
      lastFirework[socket.id] = Date.now();
      updates.fireworks.push({
        id: socket.id + Date.now(),
        location: {
          x: location.x,
          y: location.y,
        },
      });
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
        disconnect: {},
        fireworks: [],
      };
      hasUpdate = false;
    }
  }, 500);
};
