<template>
  <div>
    <div
      ref="firework"
      class="firework"
      :style="{
        transform,
        'transition-duration': shootDuration,
        'animation-duration': animationDuration
      }"
    >
      <div class="firework-center"></div>
    </div>
    <div
      v-for="particle in particles"
      class="firework-particle"
      :style="{
        background: particle.background,
        transform: particle.transform,
      }"
      :key="particle.id"
    ></div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from '@vue/composition-api';

export default {
  props: ['id', 'location', 'finished', 'length', 'hue', 'xStart'],
  setup({
    id, location, finished, length, hue, xStart,
  }) {
    const particles = ref({});
    const currentLocation = ref({
      x: xStart,
      y: 1.01,
    });

    const duration = (1.01 - location.y) * 3.5;
    const shootDuration = `${duration}s`;
    const animationDuration = `${duration / 1.8}s`;

    const transform = computed(
      () => `translate3d(-50%, -50%, 0) translate3d(${currentLocation.value.x
          * 100}vw, ${currentLocation.value.y * 100}vh, 0)`,
    );

    onMounted(() => {
      setTimeout(() => {
        currentLocation.value.x = location.x;
        currentLocation.value.y = location.y;
        setTimeout(() => {
          const background = `hsl(${hue}, 100%, 70%)`;
          particles.value = Array.from({ length }, () => ({
            background,
            x: location.x,
            y: location.y,
            transform: `translate3d(-50%, -50%, 0) translate3d(${location.x
              * 100}vw, ${location.y * 100}vh, 0)`,
          }));
          setTimeout(() => {
            // https://stackoverflow.com/a/13608420
            particles.value.forEach((particle, i) => {
              const r = (window.innerHeight / window.innerWidth) * 0.3 * Math.random();
              const x = location.x + r * Math.cos((2 * Math.PI * i) / length);
              const y = location.y + r * Math.sin((2 * Math.PI * i) / length);
              particle.transform = `translate3d(-50%, -50%, 0) translate3d(${x
                * 100}vw, ${y * 100}vh, 0)`;
            });

            setTimeout(() => {
              finished(id);
            }, 3500);
          }, 100);
        }, duration * 1000 * 0.95);
      }, 100);
    });

    return {
      particles,
      transform,
      shootDuration,
      animationDuration,
    };
  },
};
</script>

<style scoped>
.firework {
  mix-blend-mode: hard-light;
  filter: blur(0.12vmin);
  opacity: 0;
  position: absolute;
  transition: transform ease-in-out;
  animation: fade-in alternate 2;
  perspective: 1000;
}

.firework-center {
  width: 1.2vmin;
  height: 1.2vmin;
  border-radius: 50%;
  background: #aca6a6;
}

.firework-particle {
  width: 1vmin;
  height: 1vmin;
  opacity: 0;
  position: absolute;
  border-radius: 50%;
  filter: blur(0.12vmin);
  transition: transform cubic-bezier(0.25, 0.89, 0.71, 1.37);
  animation: fade-out alternate 1;
  transition-duration: 2s;
  animation-duration: 2s;
  perspective: 1000;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fade-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
