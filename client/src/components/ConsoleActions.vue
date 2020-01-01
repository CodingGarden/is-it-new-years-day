<template>
  <div></div>
</template>

<script>
import { parse } from 'twemoji-parser';

export default {
  props: ['socket'],
  setup({ socket }) {
    function setEmoji(text) {
      const emojis = parse(text);
      if (emojis.length) {
        socket.emit('set-emoji', emojis[0].text, (msg) => {
          console.info(msg);
        });
      } else {
        console.error('Invalid emoji', text);
      }
    }

    window.actions = {
      setEmoji,
    };
  },
};
</script>

<style>

</style>
