<template>
  <span
    class="mouse"
    :class="{
      smoothTransition: isSmooth,
    }"
    :style="{
        transform,
      }"
  >
    <img src="https://twemoji.maxcdn.com/v/latest/72x72/2764.png" />
  </span>
</template>

<script>
export default {
  props: ['transform', 'isSmooth'],
};
</script>

<style scoped>
.mouse {
  position: absolute;
  top: 0;
  left: 0;
}

.smoothTransition {
  transition: transform 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>
