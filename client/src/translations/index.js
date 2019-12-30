const roundValue = value => Math.floor(Math.abs(value));

const translateTimeAllPlural = ({
  translations,
  values,
}) => Object.entries(values)
  .reduce((all, [prop, value]) => {
    if (!value) return all;
    const unit = translations[prop];
    return `${all} ${roundValue(value)} ${unit}`;
  }, '');

const translateCommonWithPlural = ({
  translations,
  values,
}) => Object.entries(values)
  .reduce((all, [prop, value]) => {
    if (!value) return all;
    let unit = translations[prop];
    if (value === 1) {
      unit = translations[prop.slice(0, -1)];
    }
    return `${all} ${roundValue(value)} ${unit}`;
  }, '');

const english = ({
  isNewYearsDay,
  months,
  days,
  hours,
  minutes,
  seconds,
}) => {
  const timeLeft = translateCommonWithPlural({
    translations: {
      months: 'months',
      days: 'days',
      hours: 'hours',
      minutes: 'minutes',
      seconds: 'seconds',
      month: 'month',
      day: 'day',
      hour: 'hour',
      minute: 'minute',
      second: 'second',
    },
    values: {
      months,
      days,
      hours,
      minutes,
      seconds,
    },
  });

  if (isNewYearsDay) {
    return `It has been New Year's day for${timeLeft}`;
  }
  return `${timeLeft} until New Year's day`;
};

const turkish = ({
  isNewYearsDay,
  months,
  days,
  hours,
  minutes,
  seconds,
}) => {
  const translatedTime = translateTimeAllPlural({
    translations: {
      months: 'ay',
      days: 'gün',
      hours: 'saat',
      minutes: 'dakika',
      seconds: 'saniye',
    },
    values: {
      months,
      days,
      hours,
      minutes,
      seconds,
    },
  });

  if (isNewYearsDay) {
    return `Şu kadar süredir yeni yıldayız:${translatedTime}`;
  }
  return `Yılbaşına${translatedTime} kaldı!`;
};

const danish = ({
  isNewYearsDay,
  months,
  days,
  hours,
  minutes,
  seconds,
}) => {
  const timeLeft = translateCommonWithPlural({
    translations: {
      months: 'måneder',
      month: 'måned',
      days: 'dage',
      day: 'dag',
      hours: 'timer',
      hour: 'time',
      minutes: 'minutter',
      minute: 'minut',
      seconds: 'sekunder',
      second: 'sekund',
    },
    values: {
      months,
      days,
      hours,
      minutes,
      seconds,
    },
  });

  if (isNewYearsDay) {
    return `Det har været nytårsdag i${timeLeft}`;
  }
  return `${timeLeft} indtil det er nytårsaften`;
};

// key is the language code. See src/translations.json for language codes
module.exports = {
  en: english,
  da: danish,
  tr: turkish,
};
