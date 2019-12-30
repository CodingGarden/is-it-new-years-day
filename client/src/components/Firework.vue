<template>
  <div
    class="firework"
    :style="{
      transform,
      'transition-duration': shootDuration,
      'animation-duration': animationDuration
    }"
  >
    <div class="firework-center">
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from '@vue/composition-api';

export default {
  props: ['location'],
  setup({ location }) {
    const currentLocation = ref({
      x: location.x,
      y: 1.1,
    });

    const duration = (1.1 - location.y) * 3.5;
    const shootDuration = `${duration}s`;
    const animationDuration = `${duration / 2}s`;

    const transform = computed(() => `translate(-50%, -50%) translate(${currentLocation.value.x * 100}vw, ${currentLocation.value.y * 100}vh)`);

    onMounted(() => {
      setTimeout(() => {
        currentLocation.value.y = location.y;
      }, 100);
    });

    return {
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
  box-shadow: 0px 0px 5px #ffffff;
  opacity: 0;
  position: absolute;
  transition: transform cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: fade-in alternate 2;
}

.firework-center {
  width: 1vw;
  height: 1vw;
  border-radius: 50%;
  background: #ffffff;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
