<template>
  <span
    class="mouse"
    :class="{
      smoothTransition: isSmooth,
    }"
    :style="{
      transform: `translate3d(-50%, -50%, 0)
        translate3d(${isMine ? `${location.x}px` : `${location.x * 100}vw`},
          ${isMine ? `${location.y}px` : `${location.y * 100}vh`}, 0)
        scale(0.5)`,
    }"
  >
    <span class="emoji" v-if="!emoji">💜</span>
    <span class="emoji" v-if="emoji">{{emoji}}</span>
  </span>
</template>

<script>
export default {
  props: ['location', 'isSmooth', 'isMine', 'emoji'],
};
</script>

<style scoped>
.mouse {
  position: absolute;
  top: 0;
  left: 0;
  perspective: 1000;
}

.smoothTransition {
  transition: transform 100ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.emoji {
  font-size: 5rem;
}
</style>
