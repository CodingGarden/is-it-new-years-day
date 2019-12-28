<template>
  <div class="landing">
    <count-down />
  </div>
</template>

<script>
import CountDown from './CountDown.vue';

export default {
  components: {
    CountDown,
  },
};
</script>

<style scoped>
.landing {
  width: 100%;
  height: 100%;
  background: black;
  color: white;
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
