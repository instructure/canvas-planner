import { combineReducers } from 'redux';
import { handleAction } from 'redux-actions';
import items from './items-reducer';
import days from './days-reducer';
import loading from './loading-reducer';
import courses from './courses-reducer';
import opportunities from './opportunities-reducer';
import pendingItems from './pending-items-reducer';

const locale = handleAction('INITIAL_OPTIONS', (state, action) => {
  return action.payload.locale;
}, 'en');

const timeZone = handleAction('INITIAL_OPTIONS', (state, action) => {
  return action.payload.timeZone;
}, 'UTC');

const firstNewActivityDate = handleAction('FOUND_FIRST_NEW_ACTIVITY_DATE', (state, action) => {
  return action.payload.clone();
}, null);

export default combineReducers({
  courses,
  locale,
  timeZone,
  items,
  days,
  loading,
  firstNewActivityDate,
  opportunities,
  pendingItems,
});
