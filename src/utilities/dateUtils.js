import moment from 'moment-timezone';
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

export function isInPast (date, today = moment()) {
  const momentizedDate = new moment(date);
  return momentizedDate.isBefore(today, 'day');
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

export function formatDayKey (date) {
  return moment(date, moment.ISO_8601).format('YYYY-MM-DD');
}

export function getFirstLoadedMoment (days, timeZone) {
  if (!days.length) return moment().tz(timeZone).startOf('day');
  const firstLoadedDay = days[0];
  const firstLoadedItem = firstLoadedDay[1][0];
  return firstLoadedItem.dateBucketMoment.clone();
}

export function getLastLoadedMoment (days, timeZone) {
  if (!days.length) return moment().tz(timeZone).startOf('day');
  const lastLoadedDay = days[days.length-1];
  const loadedItem = lastLoadedDay[1][0];
  return loadedItem.dateBucketMoment.clone();
}
