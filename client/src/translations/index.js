const roundValue = value => Math.floor(Math.abs(value));

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

const standardTranslate = ({
  translation,
  timevalues,
}) => {
  return translateCommonWithPlural({
    translations: translation,
    values: {
      months: timevalues.months,
      days: timevalues.days,
      hours: timevalues.hours,
      minutes: timevalues.minutes,
      seconds: timevalues.seconds,
    },
  });

};

const russian = ({
  isNewYearsDay,
  months,
  days,
  hours,
  minutes,
  seconds,
}) => {
  let timeLeft = '';
  if (months > 0) {
    timeLeft += months;
    if (months === 1) {
      timeLeft += ' месяц ';
    } else if (months < 5 && months % 10 !== 0) {
      timeLeft += ' месяца ';
    } else {
      timeLeft += ' месяцев ';
    }
  }

  if ((days > 0) || (days === 0 && timeLeft)) {
    timeLeft += days;
    if (days % 10 === 1 && days !== 11) {
      timeLeft += ' день ';
    } else if (days % 10 < 5 && days !== 0 && (days % 100 > 19
      || days % 100 < 10) && days % 10 !== 0) {
      timeLeft += ' дня ';
    } else {
      timeLeft += ' дней ';
    }
  }

  if ((hours > 0) || (hours === 0 && timeLeft)) {
    timeLeft += hours;
    if (hours % 10 === 1 && hours !== 11) {
      timeLeft += ' час ';
    } else if (hours % 10 < 5 && hours !== 0 && (hours % 100 > 19
      || hours % 100 < 10) && hours % 10 !== 0) {
      timeLeft += ' часа ';
    } else {
      timeLeft += ' часов ';
    }
  }

  if ((minutes > 0) || (minutes === 0 && timeLeft)) {
    timeLeft += minutes;
    if (minutes % 10 === 1 && minutes !== 11) {
      timeLeft += ' минуту ';
    } else if (minutes % 10 < 5 && minutes !== 0 && (minutes % 100 > 19
      || days % 100 < 10) && days % 10 !== 0) {
      timeLeft += ' минуты ';
    } else {
      timeLeft += ' минут ';
    }
  }

  const secondsVal = roundValue(seconds);
  if ((secondsVal > 0) || (secondsVal === 0 && timeLeft)) {
    timeLeft += secondsVal;
    if (secondsVal % 10 === 1 && secondsVal !== 11) {
      timeLeft += ' секунду';
    } else if (secondsVal % 10 < 5 && secondsVal !== 0 && (secondsVal % 100 > 19
      || secondsVal % 100 < 10) && secondsVal % 10 !== 0) {
      timeLeft += ' секунды';
    } else {
      timeLeft += ' секунд';
    }
  }

  if (isNewYearsDay) {
    return `Новый год наступил ${timeLeft} назад`;
  }
  return `Новый год наступит через ${timeLeft}`;
};

// key is the language code. See src/translations.json for language codes
module.exports = {
  ru: russian,
  translate: standardTranslate,
};
