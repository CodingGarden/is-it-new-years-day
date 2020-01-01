const crypto = require('crypto');
const socketIO = require('socket.io');
const twemoji = require('twemoji-parser');

const {
  MAX_ERROR_COUNT = 20,
  IP_SALT,
} = process.env;

module.exports = (server) => {
  const io = socketIO(server);

  const byIPHash = {};
  const state = {};
  const lastMessage = {};
  const lastFirework = {};
  const errors = {};
  let hasUpdate = false;
  let updates = {
    totalConnections: 0,
    move: {},
    disconnect: {},
    fireworks: [],
    emojis: {},
  };

  function totalConnections() {
    return new Promise((resolve) => {
      io.clients((error, clients) => {
        if (clients) {
          updates.totalConnections = clients.length;
          return resolve(clients.length);
        }
        return resolve(0);
      });
    });
  }

  // eslint-disable-next-line
  async function onConnection(socket) {
    hasUpdate = true;
    const ip = socket.handshake.headers['x-real-ip'];
    const hashedIP = crypto.createHash('md5').update(IP_SALT + ip + IP_SALT).digest('hex');
    if (byIPHash[hashedIP]) {
      if (byIPHash[hashedIP] >= 5) {
        console.log(hashedIP, 'Maximum connection limit reached.');
        socket.emit('update-error', 'Maximum connection limit reached.');
        return socket.disconnect(true);
      }
      byIPHash[hashedIP] += 1;
    } else {
      byIPHash[hashedIP] = 1;
    }
    console.log('connected', socket.id);
    socket.emit('state', state);
    let total = await totalConnections();
    console.log('Connected clients:', total);
    console.log(byIPHash);
    // no tolerence for funny business
    function noFunnyBusiness(message, drop = false) {
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
    }

    function valid(lastTime, location, type = 'updates', maxDiff = 80) {
      if (!location || !('x' in location) || !('y' in location)) {
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

    function updateLocation(location) {
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
        socketUpdates.push({
          x: location.x,
          y: location.y
        });
        hasUpdate = true;
      } else if (!lastLocation) {
        socketUpdates.push({
          x: location.x,
          y: location.y
        });
        hasUpdate = true;
      }
    }

    function addFirework(location) {
      if (!valid(lastFirework, location, 'fireworks', 2500)) return;
      if (updates.fireworks.length >= 20) return;
      lastFirework[socket.id] = Date.now();
      updates.fireworks.push({
        id: socket.id + Date.now() + Math.floor(Math.random() * 1000),
        xStart: Math.random(),
        hue: Math.floor(Math.random() * 360),
        length: 10 + Math.floor(20 * Math.random()),
        location: {
          x: location.x,
          y: location.y,
        },
      });
      hasUpdate = true;
    }

    function setEmoji(input) {
      const [{ text: emoji }] = twemoji.parse(input);
      if (emoji) {
        state[socket.id].emoji = emoji;
        updates.emojis[socket.id] = emoji;
        hasUpdate = true;
        socket.emit('update-message', `Emoji set to ${emoji}`);
      }
    }

    async function disconnected() {
      console.log('disconnected', socket.id);
      byIPHash[hashedIP] -= 1;
      if (byIPHash[hashedIP] === 0) {
        delete byIPHash[hashedIP];
      }
      delete state[socket.id];
      delete errors[socket.id];
      delete lastMessage[socket.id];
      delete lastFirework[socket.id];
      updates.disconnect[socket.id] = true;
      hasUpdate = true;
      total = await totalConnections();
      console.log('Connected clients:', total);
    }

    // eslint-disable-next-line
    socket.on('location', updateLocation);
    socket.on('firework', addFirework);
    socket.on('disconnect', disconnected);
    socket.on('set-emoji', setEmoji);
  }

  io.on('connection', onConnection);

  async function sendUpdate() {
    if (hasUpdate) {
      const total = await totalConnections();
      io.volatile.emit('update', updates);
      updates = {
        totalConnections: total,
        move: {},
        disconnect: {},
        fireworks: [],
        emojis: {},
      };
      hasUpdate = false;
    }

    setTimeout(sendUpdate, 500);
  }

  setTimeout(sendUpdate, 500);
};
