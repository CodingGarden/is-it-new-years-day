<template>
  <mouse :isMine="true" :transform="transform" />
</template>

<script>
import { reactive, computed } from '@vue/composition-api';

import Mouse from './Mouse.vue';

if (!Math.clamp) Math.clamp = (val, min, max) => Math.min(max, Math.max(val, min));

export default {
  props: ['socket'],
  components: {
    Mouse,
  },
  setup({ socket }) {
    const location = reactive({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    const lastLocation = reactive({
      x: location.x,
      y: location.y,
    });

    const transform = computed(
      () => `translate(-50%, -50%) translate(${location.x}px, ${location.y}px) scale(0.5)`,
    );

    document.addEventListener('mousemove', (ev) => {
      location.x = ev.x;
      location.y = ev.y;
    });

    function updateLocation() {
      if (
        Math.abs(lastLocation.x - location.x) > 0.001
        || Math.abs(lastLocation.y - location.y) > 0.001
      ) {
        lastLocation.x = location.x;
        lastLocation.y = location.y;
        socket.emit('location', {
          x: Math.clamp(location.x / window.innerWidth, 0, 1),
          y: Math.clamp(location.y / window.innerHeight, 0, 1),
        });
      }

      setTimeout(updateLocation, 200);
    }

    socket.on('connect', () => {
      updateLocation();
    });

    return {
      location,
      transform,
    };
  },
};
</script>
