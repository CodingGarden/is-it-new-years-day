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
// read in lanuage from translations.json
const translationDb = allTranslations[language] || translations.en;
// load translation function from translation/index.js --> default translate function
const specialTranslation = translations[language] || translations.translate;

export default {
  setup() {
    const favicon = document.querySelector('link[rel="icon"]');
    const ready = ref(false);
    const timeTranslation = ref('Maybe...');
    let now = DateTime.local();
    const isNewYearsDay = ref(false);

    const durationProps = ['months', 'days', 'hours', 'minutes', 'seconds'];

    // calls functions in translations/index.js with correct arguments
    function createTimeString(values) {
      // if specialtranslation is default, call with two arguments
      if (specialTranslation === translations.translate) {
        return specialTranslation({
          translation: translationDb,
          timevalues: values,
        });
      }
      // otherwise call with one argument object
      return specialTranslation(values);
    }

    function updateClock() {
      ready.value = true;
      now = DateTime.local();
      let newYearsDay = DateTime.local(now.year, 1, 1);

      isNewYearsDay.value = now.hasSame(newYearsDay, 'day');

      if (isNewYearsDay.value) {
        // set time string to translated text
        timeTranslation.value = createTimeString(newYearsDay.diffNow(durationProps));
        // if used method is default
        if (specialTranslation === translations.translate) {
          // replace possibly the $time$ string
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

        // set time string to translated text
        timeTranslation.value = createTimeString(newYearsDay.diffNow(durationProps));
        // if standard translate function was used
        if (specialTranslation === translations.translate) {
          // replace possibly the $time$ function
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
