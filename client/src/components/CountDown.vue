<template>
  <div>
    <div v-if="ready">
      <p class="yes-no" v-if="isNewYearsDay">YES</p>
      <p class="yes-no" v-else>NO</p>
    </div>
    <p class="time-left">{{currentTime}}</p>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api';
import { formatDistanceToNow, isSameDay } from 'date-fns';

const formatOptions = {
  addSuffix: true,
  includeSeconds: true,
};

export default {
  setup() {
    const ready = ref(false);
    const currentTime = ref('Maybe...');
    const now = new Date();
    const isNewYearsDay = ref(isSameDay(now, new Date(now.getFullYear(), 0, 1)));
    let newYearsDay = new Date(now.getFullYear() + 1, 0, 1);

    setInterval(() => {
      ready.value = true;
      // eslint-disable-next-line
      const now = new Date();
      isNewYearsDay.value = isSameDay(now, new Date(now.getFullYear(), 0, 1));
      if (isNewYearsDay.value) {
        newYearsDay = new Date(now.getFullYear(), 0, 1);
        isNewYearsDay.value = true;
        currentTime.value = `It's been New Years day for ${formatDistanceToNow(newYearsDay)}`;
        document.title = 'YES';
      } else {
        newYearsDay = new Date(now.getFullYear() + 1, 0, 1);
        isNewYearsDay.value = false;
        currentTime.value = formatDistanceToNow(newYearsDay, formatOptions);
        document.title = currentTime.value;
      }
    }, 500);

    return {
      ready,
      currentTime,
      isNewYearsDay,
    };
  },
};
</script>

<style scoped>
.yes-no {
  margin: 2rem;
  text-align: center;
  font-size: calc(2rem + 8vmin);
}

.time-left {
  text-align: center;
  font-size: calc(1rem + 4vmin);
}
</style>
