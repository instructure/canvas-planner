import moment from 'moment';
import { isToday, getFriendlyDate, getFullDate, isInPast } from '../dateUtils';


describe('isToday', () => {
  it('returns true when the date passed in is the current date', () => {
    const date = moment();
    expect(isToday(date)).toBeTruthy();
  });

  it('returns true when the current date is passed in as a string', () => {
    const date = '2017-04-25';
    const fakeToday = moment(date);
    expect(isToday(date, fakeToday)).toBeTruthy();
  });

  it('returns false when the date passed in is not today', () => {
    const date = '2016-04-25';
    expect(isToday(date)).toBeFalsy();
  });
});

describe('getFriendlyDate', () => {
  it('returns "Today" when the date given is today', () => {
    const date = moment();
    expect(getFriendlyDate(date)).toBe('Today');
  });

  it('returns "Yesterday" when the date given is yesterday', () => {
    const date = moment().subtract(1, 'days');
    expect(getFriendlyDate(date)).toBe('Yesterday');
  });

  it('returns "Tomorrow" when the date given is tomorrow', () => {
    const date = moment().add(1, 'days');
    expect(getFriendlyDate(date)).toBe('Tomorrow');
  });

  it('returns the day of the week for any other date', () => {
    const date = moment().add(3, 'days');
    expect(getFriendlyDate(date)).toBe(date.format('dddd'));
  });
});

describe('getFullDate', () => {
  it('returns the day of the week month and day for special days', () => {
    const date = moment();
    expect(getFullDate(date)).toEqual(date.format('dddd, MMMM D'));
  });

  it('returns the format month day year when not a special day', () => {
    const date = moment().add(3, 'days');
    expect(getFullDate(date)).toEqual(date.format('MMMM D, YYYY'));
  });
});

describe('isInPast', () => {
  it('returns true when the date is before today', () => {
    const date = moment().subtract(1, 'days');
    expect(isInPast(date)).toBeTruthy();
  });

  it('returns false when the date is today', () => {
    const date = moment();
    expect(isInPast(date)).toBeFalsy();
  });

  it('returns false when the date is after today', () => {
    const date = moment().add(1, 'days');
    expect(isInPast(date)).toBeFalsy();
  });
});
