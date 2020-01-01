<template>
  <div class="landing">
    <count-down />
    <mouse-listener :socket="socket" :emoji="emoji" />
    <client-state :clearState="idle" :socket="socket" :setEmoji="setEmoji" />
    <fireworks :socket="socket" />
    <console-actions :socket="socket" />
    <h1 class="idle-error" v-if="idle">Idle timeout. Refresh page to re-connect.</h1>
  </div>
</template>

<script>
import io from 'socket.io-client';
import { ref } from '@vue/composition-api';

import ConsoleActions from './ConsoleActions.vue';
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
    ConsoleActions,
  },
  setup() {
    const socket = io(API_URL);
    const emoji = ref('💚');
    const idle = ref(false);

    socket.on('update-error', (message) => {
      // eslint-disable-next-line
      console.error(message);
      if (message === 'Idle timeout.') {
        idle.value = true;
      }
    });

    function setEmoji(value) {
      emoji.value = value;
    }

    return {
      idle,
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
  flex-direction: column;
}

.idle-error {
  color: red;
  margin: 1rem;
  z-index: 1;
}
</style>
