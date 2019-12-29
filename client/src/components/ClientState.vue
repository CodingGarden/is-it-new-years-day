<template>
  <div>
    <mouse
      v-for="client in clients"
      :location="client.location"
      :isSmooth="true"
      :key="client.id"
    />
  </div>
</template>

<script>
import { ref, computed } from '@vue/composition-api';

import Mouse from './Mouse.vue';

function sleep(ms) {
  return new Promise(resolve => setTimeout(() => resolve, ms));
}

export default {
  components: {
    Mouse,
  },
  props: ['socket'],
  setup({ socket }) {
    const clientsBydId = ref({});
    const clients = computed(() => Object.values(clientsBydId.value));
    socket.on('state', (state) => {
      clientsBydId.value = Object.entries(state).reduce(
        (byId, [id, location]) => {
          if (id !== socket.id) {
            const mouse = {
              id,
              location,
            };
            // eslint-disable-next-line
            byId[id] = mouse;
          }
          return byId;
        },
        {},
      );
    });

    socket.on('update', (updates) => {
      Object.entries(updates.move).forEach(async ([id, moves]) => {
        if (id !== socket.id) {
          while (moves.length) {
            const lastMove = moves.shift();
            clientsBydId.value[id] = {
              id,
              location: lastMove,
            };
            // eslint-disable-next-line
            await sleep(250);
          }
        }
      }, []);
      clientsBydId.value = Object.entries(clientsBydId.value).reduce(
        (byId, [id, mouse]) => {
          if (id !== socket.id && !updates.disconnect[id]) {
            // eslint-disable-next-line
            byId[id] = mouse;
          }
          return byId;
        },
        {},
      );
    });

    return {
      clients,
    };
  },
};
</script>

<style>
</style>
