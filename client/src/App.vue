<template>
  <div id="app">
    <Landing />
  </div>
</template>

<script>
import Landing from './components/Landing.vue';

export default {
  name: 'app',
  components: {
    Landing,
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

body {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  cursor: none;
}

#app {
  width: 100%;
  height: 100%;
}
</style>
