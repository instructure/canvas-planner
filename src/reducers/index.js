import { combineReducers } from 'redux';
import { handleAction } from 'redux-actions';
import items from './items-reducer';
import days from './days-reducer';
import loading from './loading-reducer';
import courses from './courses-reducer';

const locale = handleAction('INITIAL_OPTIONS', (state, action) => {
  return action.payload.locale;
}, 'en');

const timeZone = handleAction('INITIAL_OPTIONS', (state, action) => {
  return action.payload.timeZone;
}, 'UTC');

export default combineReducers({
  courses,
  locale,
  timeZone,
  items,
  days,
  loading
});
