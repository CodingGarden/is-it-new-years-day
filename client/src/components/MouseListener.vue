<template>
  <mouse :isMine="true" :location="location" />
</template>

<script>
import { reactive } from '@vue/composition-api';

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

    let lastFireWorkSent;
    document.addEventListener('mousedown', (ev) => {
      if (!lastFireWorkSent || (Date.now() - lastFireWorkSent) > 5000) {
        const fwLocation = {
          x: Math.clamp(ev.x / window.innerWidth, 0, 1),
          y: Math.clamp(ev.y / window.innerHeight, 0, 1),
        };
        socket.emit('firework', fwLocation);
        lastFireWorkSent = Date.now();
      }
    });

    document.addEventListener('mousemove', (ev) => {
      location.x = ev.x;
      location.y = ev.y;
    });

    document.addEventListener('touchmove', (ev) => {
      if (ev.touches && ev.touches.length) {
        location.x = ev.touches[0].pageX;
        location.y = ev.touches[0].pageY;
      }
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

      setTimeout(updateLocation, 100);
    }

    socket.on('connect', () => {
      setTimeout(updateLocation, 2000);
    });

    return {
      location,
    };
  },
};
</script>
