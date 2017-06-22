import { combineReducers } from 'redux';
import { handleAction } from 'redux-actions';
import days from './days-reducer';
import loading from './loading-reducer';
import courses from './courses-reducer';
import opportunities from './opportunities-reducer';
import pendingItems from './pending-items-reducer';
import todo from './todo-reducer';

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
  days,
  loading,
  firstNewActivityDate,
  opportunities,
  pendingItems,
  todo,
});
