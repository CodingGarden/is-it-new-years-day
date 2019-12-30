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


const spanish = ({
  isNewYearsDay,
  months,
  days,
  hours,
  minutes,
  seconds,
}) => {
  const timeLeft = translateCommonWithPlural({
    translations: {
      months: 'meses',
      days: 'dias',
      hours: 'horas',
      minutes: 'minutos',
      seconds: 'segundos',
      month: 'mes',
      day: 'dia',
      hour: 'hora',
      minute: 'minuto',
      second: 'segundo',
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
    return `Es año nuevo desde hace ${timeLeft}`;
  }
  return `Faltan ${timeLeft} para Año Nuevo`;
};


const portuguese = ({
  isNewYearsDay,
  months,
  days,
  hours,
  minutes,
  seconds,
}) => {
  const timeLeft = translateCommonWithPlural({
    translations: {
      months: 'meses',
      days: 'dias',
      hours: 'horas',
      minutes: 'minutos',
      seconds: 'segundos',
      month: 'mês',
      day: 'dia',
      hour: 'hora',
      minute: 'minuto',
      second: 'segundo',
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
    return `Foi o dia de ano novo por ${timeLeft}`;
  }
  return `${timeLeft} até o dia de Ano Novo`;
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
    } else if (days % 10 < 5 && days !== 0 && (days % 100 > 19 || days % 100 < 10) && days
      % 10 !== 0) {
      timeLeft += ' дня ';
    } else {
      timeLeft += ' дней ';
    }
  }

  if ((hours > 0) || (hours === 0 && timeLeft)) {
    timeLeft += hours;
    if (hours % 10 === 1 && hours !== 11) {
      timeLeft += ' час ';
    } else if (hours % 10 < 5 && hours !== 0 && (hours % 100 > 19 || hours % 100 < 10) && hours
      % 10 !== 0) {
      timeLeft += ' часа ';
    } else {
      timeLeft += ' часов ';
    }
  }

  if ((minutes > 0) || (minutes === 0 && timeLeft)) {
    timeLeft += minutes;
    if (minutes % 10 === 1 && minutes !== 11) {
      timeLeft += ' минуту ';
    } else if (minutes % 10 < 5 && minutes !== 0 && (minutes % 100 > 19 || days % 100 < 10)
      && days % 10 !== 0) {
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
    } else if (secondsVal % 10 < 5 && secondsVal !== 0 && (secondsVal % 100 > 19 || secondsVal
        % 100 < 10) && secondsVal % 10 !== 0) {
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

const french = ({
  isNewYearsDay,
  months,
  days,
  hours,
  minutes,
  seconds,
}) => {
  const timeLeft = translateCommonWithPlural({
    translations: {
      months: 'mois',
      days: 'jours',
      hours: 'heures',
      minutes: 'minutes',
      seconds: 'secondes',
      month: 'mois',
      day: 'jour',
      hour: 'heure',
      minute: 'minute',
      second: 'seconde',
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
    return `C'est le jour de l'an depuis ${timeLeft}`;
  }
  return `${timeLeft} avant le jour de l'an`;
};

const slovak = ({
  isNewYearsDay,
  months,
  days,
  hours,
  minutes,
  seconds,
}) => {
  let timeLeft = '';

  if (months > 0) {
    timeLeft += `${months} `;
    timeLeft += months === 1 ? 'mesiac ' : (months < 5 ? 'mesiace ' : 'mesiacov ');
  }

  if (days > 0 || timeLeft !== '') {
    timeLeft += `${days} `;
    timeLeft += days === 1 ? 'deň ' : (days < 5 && days > 0 ? 'dni ' : 'dní ');
  }

  if (hours > 0 || timeLeft !== '') {
    timeLeft += `${hours} `;
    timeLeft += hours === 1 ? 'hodina ' : (hours < 5 && hours > 0 ? 'hodiny ' : 'hodín ');
  }

  if (minutes > 0 || timeLeft !== '') {
    timeLeft += `${minutes} `;
    timeLeft += minutes === 1 ? 'minúta ' : (minutes < 5 && minutes > 0 ? 'minúty ' : 'minút ');
  }

  if (seconds > 0 || timeLeft !== '') {
    timeLeft += `${roundValue(seconds)} `;
    timeLeft += seconds === 1 ? 'sekunda ' : (seconds < 5 && seconds > 0 ? 'sekundy '
      : 'sekúnd ');
  }

  timeLeft = timeLeft.slice(0, -1);

  if (isNewYearsDay) {
    return `Nový rok máme ${timeLeft}`;
  }
  return `Do Nového roku zostáva: ${timeLeft}`;
};

const czech = ({
  isNewYearsDay,
  months,
  days,
  hours,
  minutes,
  seconds,
}) => {
  let timeLeft = '';

  if (months > 0) {
    timeLeft += `${months} `;
    timeLeft += months === 1 ? 'měsíc ' : (months < 5 ? 'měsíce ' : 'měsíců ');
  }

  if (days > 0 || timeLeft !== '') {
    timeLeft += `${days} `;
    timeLeft += days === 1 ? 'den ' : (days < 5 && days > 0 ? 'dní ' : 'dnů ');
  }

  if (hours > 0 || timeLeft !== '') {
    timeLeft += `${hours} `;
    timeLeft += hours === 1 ? 'hodina ' : (hours < 5 && hours > 0 ? 'hodiny ' : 'hodin ');
  }

  if (minutes > 0 || timeLeft !== '') {
    timeLeft += `${minutes} `;
    timeLeft += minutes === 1 ? 'minuta ' : (minutes < 5 && minutes > 0 ? 'minuty ' : 'minut ');
  }

  if (seconds > 0 || timeLeft !== '') {
    timeLeft += `${roundValue(seconds)} `;
    timeLeft += seconds === 1 ? 'sekunda ' : (seconds < 5 && seconds > 0 ? 'sekundy '
      : 'sekund ');
  }

  timeLeft = timeLeft.slice(0, -1);

  if (isNewYearsDay) {
    return `Nový rok máme ${timeLeft}`;
  }
  return `Do Nového roku zbývá: ${timeLeft}`;
};

// key is the language code. See src/translations.json for language codes
module.exports = {
  en: english,
  es: spanish,
  pt: portuguese,
  da: danish,
  fr: french,
  tr: turkish,
  ru: russian,
  sk: slovak,
  cs: czech,
};
