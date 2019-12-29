<template>
  <div>
    <div v-if="ready">
      <p class="yes-no" v-if="isNewYearsDay">{{translation.yes}}</p>
      <p class="yes-no" v-else>{{translation.no}}</p>
      <p class="time-left" v-if="isNewYearsDay">{{translation.is}}</p>
    </div>
    <p class="time-left">{{currentTime}}</p>
    <div v-if="ready && !isNewYearsDay">
      <p class="time-left">{{translation.until}}</p>
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api';
import { DateTime } from 'luxon';

// Used https://translatr.varunmalhotra.xyz/ to generate
const translations = require('../translations.json');

// simplified version of: https://github.com/wojtekmaj/get-user-locale
function getLanguage(override) {
  const language = (override
    || (window.navigator.languages ? window.navigator.languages[0] : null)
    || window.navigator.language
    || window.navigator.userLanguage
    || window.navigator.browserLanguage
    || window.navigator.systemLanguage
    || 'en');
  return language.split('-')[0].toLowerCase();
}

const language = getLanguage();
// eslint-disable-next-line
console.log('Detected language:', language);
const translation = translations[language] || translations.en;
const relativeTime = new Intl.RelativeTimeFormat(language, { style: 'long' });

export default {
  setup() {
    const favicon = document.querySelector('link[rel="icon"]');
    const ready = ref(false);
    const currentTime = ref('Maybe...');
    let now = DateTime.local();
    const isNewYearsDay = ref(false);

    const durationProps = ['months', 'days', 'hours', 'minutes', 'seconds'];
    function formatDuration(duration) {
      return durationProps
        .reduce((format, prop) => {
          if (duration[prop]) {
            const results = relativeTime.formatToParts(
              Math.floor(Math.abs(duration[prop])),
              prop,
            );
            if (results[0].type === 'literal') results.shift();
            return `${format} ${results[0].value} ${results[1].value} `;
          }
          return format;
        }, '')
        .trim();
    }

    function updateClock() {
      ready.value = true;
      now = DateTime.local();
      let newYearsDay = DateTime.local(now.year, 1, 1);
      isNewYearsDay.value = now.hasSame(newYearsDay, 'day');
      if (isNewYearsDay.value) {
        currentTime.value = formatDuration(newYearsDay.diffNow(durationProps));
        document.title = 'YES';
        favicon.href = 'fireworks-favicon.png';
      } else {
        newYearsDay = DateTime.local(now.year + 1, 1, 1);
        currentTime.value = formatDuration(newYearsDay.diffNow(durationProps));
        document.title = 'NO';
        favicon.href = 'x-favicon.png';
      }

      setTimeout(updateClock, 500);
    }

    updateClock();

    return {
      ready,
      currentTime,
      isNewYearsDay,
      translation,
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
