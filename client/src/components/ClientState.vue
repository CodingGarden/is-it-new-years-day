<template>
  <div>
    <mouse
      v-for="client in clients"
      :location="client.location"
      :isSmooth="true"
      :key="client.id"
      :emoji="client.emoji"
    />
  </div>
</template>

<script>
import { ref, computed } from '@vue/composition-api';

import Mouse from './Mouse.vue';

export default {
  components: {
    Mouse,
  },
  props: ['socket', 'setEmoji'],
  setup({ socket, setEmoji }) {
    const clientsBydId = ref({});
    const clients = computed(() => Object.values(clientsBydId.value));
    socket.on('state', (state) => {
      clientsBydId.value = Object.entries(state).reduce(
        (byId, [id, clientState]) => {
          console.log(clientState);
          if (id !== socket.id) {
            const client = {
              id,
              emoji: clientState.emoji,
              location: {
                x: clientState.x,
                y: clientState.y,
              },
              moves: [],
            };
            byId[id] = client;
          }
          return byId;
        },
        {},
      );
    });

    const hasMoves = {};

    socket.on('update', (updates) => {
      Object.entries(updates.move).forEach(async ([id, moves]) => {
        if (id !== socket.id) {
          clientsBydId.value[id] = clientsBydId.value[id] || {
            id,
            location: { x: 0, y: 0 },
            moves: [],
          };
          clientsBydId.value[id].moves = clientsBydId.value[id].moves.concat(moves);
          hasMoves[id] = true;
        }
      }, []);
      clientsBydId.value = Object.entries(clientsBydId.value).reduce(
        (byId, [id, client]) => {
          if (id !== socket.id && !updates.disconnect[id]) {
            byId[id] = client;
          }
          return byId;
        },
        {},
      );
      Object.entries(updates.emojis).forEach(([id, emoji]) => {
        if (clientsBydId.value[id]) {
          clientsBydId.value[id].emoji = emoji;
        } else if (id === socket.id) {
          setEmoji(emoji);
        }
      });
    });

    async function updateLocations() {
      Object.keys(hasMoves).forEach((id) => {
        const client = clientsBydId.value[id];
        if (client && client.moves.length > 0) {
          const nextLocation = client.moves.shift();
          client.location = nextLocation;
        } else {
          delete hasMoves[id];
        }
      });
      setTimeout(() => {
        updateLocations();
      }, 100);
    }

    updateLocations();

    return {
      clients,
    };
  },
};
</script>

<style>
</style>
