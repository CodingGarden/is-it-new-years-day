<template>
  <div class="landing">
    <count-down />
    <mouse-listener :socket="socket" :emoji="emoji" />
    <client-state :socket="socket" :setEmoji="setEmoji" />
    <fireworks :socket="socket" />
    <console :socket="socket" />
  </div>
</template>

<script>
import io from 'socket.io-client';
import { ref } from '@vue/composition-api';

import Console from './Console.vue';
import CountDown from './CountDown.vue';
import MouseListener from './MouseListener.vue';
import ClientState from './ClientState.vue';
import Fireworks from './Fireworks.vue';

import API_URL from '../API_URL';

export default {
  components: {
    CountDown,
    MouseListener,
    ClientState,
    Fireworks,
    Console,
  },
  setup() {
    const socket = io(API_URL);
    const emoji = ref('💚');

    socket.on('update-error', (message) => {
      // eslint-disable-next-line
      console.error(message);
    });
    socket.on('update-message', (message) => {
      // eslint-disable-next-line
      console.info(message);
    });

    function setEmoji(value) {
      emoji.value = value;
    }

    return {
      socket,
      setEmoji,
      emoji,
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
