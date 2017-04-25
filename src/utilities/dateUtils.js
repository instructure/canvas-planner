import moment from 'moment';
import formatMessage from '../format-message';

function getTodaysDetails () {
  const today = moment();
  const yesterday = today.clone().subtract(1, 'days');
  const tomorrow = today.clone().add(1, 'days');

  return { today, yesterday, tomorrow };
}

function isSpecialDay (date) {
  const { today, yesterday, tomorrow } = getTodaysDetails();
  const momentizedDate = new moment(date);

  const specialDates = [today, yesterday, tomorrow];
  return specialDates.some(sd => sd.isSame(momentizedDate, 'day'));
}

export function isToday (date, today = moment()) {
  const momentizedDate = new moment(date);
  return today.isSame(momentizedDate, 'day');
}

/**
* Given a date (in any format that moment will digest)
* it will return a string indicating Today, Tomorrow, Yesterday
* or the day of the week if it doesn't fit in any of those categories
*/
export function getFriendlyDate (date) {
  const { today, yesterday, tomorrow } = getTodaysDetails();
  const momentizedDate = new moment(date);

  if (isToday(date, today)) {
    return formatMessage('Today');
  } else if (yesterday.isSame(momentizedDate, 'day')) {
    return formatMessage('Yesterday');
  } else if (tomorrow.isSame(momentizedDate, 'day')) {
    return formatMessage('Tomorrow');
  } else {
    return momentizedDate.format('dddd');
  }
}


export function getFullDate (date) {
  if (isSpecialDay(date)) {
    return moment(date).format('dddd, MMMM D');
  } else {
    return moment(date).format('MMMM D, YYYY');
  }
}
