<template>
  <div>
    <mouse
      v-for="client in clients"
      :isSmooth="true"
      :transform="client.transform"
      :key="client.id"
    />
  </div>
</template>

<script>
import { ref } from '@vue/composition-api';

import Mouse from './Mouse.vue';

export default {
  components: {
    Mouse,
  },
  props: ['socket'],
  setup({ socket }) {
    const clients = ref([]);
    socket.on('state', (state) => {
      clients.value = Object.entries(state).reduce((all, [id, client]) => {
        if (id !== socket.id) {
          all.push({
            id,
            transform: `translate(-50%, -50%) translate(${client.x
              * 100}vw, ${client.y * 100}vh) scale(0.5)`,
          });
        }
        return all;
      }, []);
    });

    return {
      clients,
    };
  },
};
</script>

<style>
</style>
