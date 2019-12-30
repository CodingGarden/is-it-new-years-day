<template>
  <div class="countdown">
    <div v-if="ready">
      <p class="yes-no" v-if="isNewYearsDay">{{translationDb.yes}}</p>
      <p class="yes-no" v-else>{{translationDb.no}}</p>
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

const language = getLanguage();
// eslint-disable-next-line
console.log('Detected language:', language);
const translationDb = allTranslations[language] || translations.en;
const specialTranslation = translations[language] || translations.translate;

export default {
  setup() {
    const favicon = document.querySelector('link[rel="icon"]');
    const ready = ref(false);
    const timeTranslation = ref('Maybe...');
    let now = DateTime.local();
    const isNewYearsDay = ref(false);

    const durationProps = ['months', 'days', 'hours', 'minutes', 'seconds'];

    function createTimeString(values) {
      if (specialTranslation === translations.translate) {
        return specialTranslation({
          translation: translationDb,
          timevalues: values,
        });
      }
      return specialTranslation(values);
    }

    function updateClock() {
      ready.value = true;
      now = DateTime.local();
      let newYearsDay = DateTime.local(now.year, 1, 1);

      isNewYearsDay.value = now.hasSame(newYearsDay, 'day');
      if (isNewYearsDay.value) {
        timeTranslation.value = createTimeString(newYearsDay.diffNow(durationProps));
        if (specialTranslation === translations.translate) {
          if (translationDb.is.includes('$time$')) {
            timeTranslation.value = translationDb.is.replace(/\$time\$/g, timeTranslation.value);
          } else {
            timeTranslation.value = `${translationDb.is} \n ${timeTranslation.value}`;
          }
        }

        document.title = translationDb.yes;
        favicon.href = 'fireworks-favicon.png';
      } else {
        newYearsDay = DateTime.local(now.year + 1, 1, 1);
        timeTranslation.value = createTimeString(newYearsDay.diffNow(durationProps));
        if (specialTranslation === translations.translate) {
          if (translationDb.until.includes('$time$')) {
            timeTranslation.value = translationDb.until.replace(/\$time\$/g, timeTranslation.value);
          } else {
            timeTranslation.value = `${timeTranslation.value} \n ${translationDb.until}`;
          }
        }
        document.title = translationDb.no;
        favicon.href = 'x-favicon.png';
      }
      setTimeout(updateClock, 500);
    }

    updateClock();

    return {
      ready,
      timeTranslation,
      isNewYearsDay,
      translationDb,
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
