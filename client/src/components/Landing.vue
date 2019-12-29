<template>
  <div class="landing">
    <count-down />
    <mouse-listener :socket="socket" />
    <client-state :socket="socket" />
  </div>
</template>

<script>
import io from 'socket.io-client';

import CountDown from './CountDown.vue';
import MouseListener from './MouseListener.vue';
import ClientState from './ClientState.vue';

import API_URL from '../API_URL';

export default {
  components: {
    CountDown,
    MouseListener,
    ClientState,
  },
  setup() {
    const socket = io(API_URL);
    socket.on('error', (message) => {
      // eslint-disable-next-line
      console.error(message);
    });
    return {
      socket,
    };
  },
};
</script>

<style scoped>
.landing {
  width: 100%;
  height: 100%;
  background: black;
  color: white;
  font-family: Arial, Helvetica, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
</style>
