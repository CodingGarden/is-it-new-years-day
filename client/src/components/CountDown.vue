<template>
  <div class="countdown">
    <div v-if="ready">
      <p class="yes-no" v-if="isNewYearsDay">{{yesNoTranslation.yes}}</p>
      <p class="yes-no" v-else>{{yesNoTranslation.no}}</p>
    </div>
    <div v-if="ready">
      <p class="time-left">{{timeTranslation}}</p>
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api';
import { DateTime } from 'luxon';

import translations from '../translations/index';

const roundValue = value => Math.floor(Math.abs(value));

// Used https://translatr.varunmalhotra.xyz/ to generate
const allTranslations = require('../translations.json');

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

const params = new URLSearchParams(window.location.search);
const language = getLanguage(params.get('lang'));
// eslint-disable-next-line
console.log('Detected language:', language);
const yesNoTranslation = allTranslations[language] || allTranslations.en;
const formatDuration = translations[language] || translations.en;

export default {
  setup() {
    const favicon = document.querySelector('link[rel="icon"]');
    const ready = ref(false);
    const timeTranslation = ref('Maybe...');
    let now = DateTime.local();
    const isNewYearsDay = ref(false);

    const durationProps = ['months', 'days', 'hours', 'minutes', 'seconds'];

    function getTimeTranslation(newYearsDay) {
      let {
        months,
        days,
        hours,
        minutes,
        seconds,
      } = newYearsDay.diffNow(durationProps);
      months = roundValue(months);
      days = roundValue(days);
      hours = roundValue(hours);
      minutes = roundValue(minutes);
      seconds = roundValue(seconds);
      if ([months, days, hours, minutes, seconds].every(val => val === 0)) return '';
      return formatDuration({
        isNewYearsDay: isNewYearsDay.value,
        months,
        days,
        hours,
        minutes,
        seconds,
      });
    }

    function updateClock() {
      ready.value = true;
      now = DateTime.local();
      let newYearsDay = DateTime.local(now.year, 1, 1);
      isNewYearsDay.value = now.hasSame(newYearsDay, 'day');
      if (isNewYearsDay.value) {
        timeTranslation.value = getTimeTranslation(newYearsDay);
        document.title = yesNoTranslation.yes;
        favicon.href = 'fireworks-favicon.png';
      } else {
        newYearsDay = DateTime.local(now.year + 1, 1, 1);
        timeTranslation.value = getTimeTranslation(newYearsDay);
        document.title = yesNoTranslation.no;
        favicon.href = 'x-favicon.png';
      }

      setTimeout(updateClock, 500);
    }

    updateClock();

    return {
      ready,
      timeTranslation,
      isNewYearsDay,
      yesNoTranslation,
    };
  },
};
</script>

<style scoped>
.countdown {
  z-index: 100;
}

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
