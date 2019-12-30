<template>
  <div class="fireworks">
    <firework v-for="firework in fireworks" :key="firework.id" :location="firework.location" />
  </div>
</template>

<script>
import { ref } from '@vue/composition-api';

import Firework from './Firework.vue';

export default {
  props: ['socket'],
  components: {
    Firework,
  },
  setup({ socket }) {
    const fireworks = ref([]);

    socket.on('update', (updates) => {
      if (updates.fireworks) {
        fireworks.value = fireworks.value.concat(updates.fireworks);
      }
    });

    return {
      fireworks,
    };
  },
};
</script>

<style scoped>
.fireworks {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
