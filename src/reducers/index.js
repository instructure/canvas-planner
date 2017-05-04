import { combineReducers } from 'redux';
import items from './items-reducer';
import days from './days-reducer';
import loading from './loading-reducer';
import courses from './courses-reducer';

export default combineReducers({
  courses,
  items,
  days,
  loading
});
