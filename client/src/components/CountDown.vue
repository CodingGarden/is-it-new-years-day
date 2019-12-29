<template>
  <div>
    <div v-if="ready">
      <p class="yes-no" v-if="isNewYearsDay">YES</p>
      <p class="yes-no" v-else>NO</p>
      <p  class="time-left" v-if="isNewYearsDay">It's been New Year's day for</p>
    </div>
    <p class="time-left">{{currentTime}}</p>
    <div v-if="ready && !isNewYearsDay">
      <p class="time-left">until New Year's day</p>
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api';
import { DateTime } from 'luxon';

export default {
  setup() {
    const ready = ref(false);
    const currentTime = ref('Maybe...');
    let now = DateTime.local();
    const isNewYearsDay = ref(false);

    const durationProps = ['months', 'days', 'hours', 'minutes', 'seconds'];
    function formatDuration(duration) {
      return durationProps.reduce((format, prop) => {
        if (duration[prop]) {
          return `${format} ${Math.floor(Math.abs(duration[prop]))} ${prop}`;
        }
        return format;
      }, '').trim();
    }

    function updateClock() {
      ready.value = true;
      now = DateTime.local();
      isNewYearsDay.value = now.hasSame(DateTime.local(now.year, 1, 1), 'day');
      if (isNewYearsDay.value) {
        const newYearsDay = DateTime.local(now.year, 1, 1);
        isNewYearsDay.value = true;
        currentTime.value = formatDuration(newYearsDay.diffNow(durationProps));
        document.title = 'YES';
      } else {
        const newYearsDay = DateTime.local(now.year + 1, 1, 1);
        isNewYearsDay.value = false;
        currentTime.value = formatDuration(newYearsDay.diffNow(durationProps));
        document.title = 'NO';
      }

      setTimeout(updateClock, 500);
    }

    updateClock();

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
  font-weight: bold;
  margin: 2rem;
  text-align: center;
  font-size: calc(2rem + 8vmin);
}

.time-left {
  text-align: center;
  font-size: calc(0.8rem + 1vmin);
}
</style>
