import { combineReducers } from 'redux';
import items from './items-reducer';
import days from './days-reducer';
import loading from './loading-reducer';

export default combineReducers({
  items,
  days,
  loading
});
